var room; // Global room object

$(function() {
	// Redirect the user if he tried to hack the URL
	if ($('#roomFrame', window.parent.document).length != 1) {
		window.location.replace('../');
		return;
	}

	room = new Room();
	room.init();
});

/**
 * Creates a new Room object
 */
function Room() {
	this.videos = [];
	this.chat_recent_blink = false; // Don't blink too often

	// These ones aren't used except for checking if the browser know what they
	// are.
	this.PeerConnection = window.webkitRTCPeerConnection;
}

/**
 * Initializes the room, connects to rtc and stuff.
 */
Room.prototype.init = function() {
	var self = this;

	$(window).resize(function() {
		self.subdivideVideos();
	});

	$('#chatbox').hide();

	if (this.PeerConnection) {
		rtc.createStream({
			'video' : true,
			'audio' : true
		}, function(stream) {
			rtc.attachStream(stream, 'you');
		}, function() {
			parent.lobby.leaveRoom();
		});
	} else {
		alert('You are not using a browser with webkitRTCPeerConnection support.');
		parent.lobby.leaveRoom();
	}
	var roomId = window.location.hash.slice(1);

	console.log('Connecting to websocket');
	rtc.connect('ws://' + window.location.host + '/', roomId);

	rtc.on('add remote stream', function(stream, socketId) {
		console.log('ADDING REMOTE STREAM...');
		var video = self.createVideo(socketId);
		rtc.attachStream(stream, video.attr('id'));
		self.subdivideVideos();

		$('#empty_message').hide();
	});
	rtc.on('disconnect stream', function(data) {
		console.log('remove ' + data);
		self.removeVideo(data);
		self.subdivideVideos();

		if (self.videos.length == 0) {
			$('#empty_message').show();
		}
	});

	parent.socket.on(parent.API_MESSAGE, function(clientID, msg) {
		self.addToChat(msg, true);
	});

	$('#chatinput').keypress(function(e) {
		if (e.which == 13) {
			var msg = $(this).val();
			if (msg.length > 0) {
				self.writeMessageToChat(parent.lobby.ownName + ': ' + msg);
			}
			$(this).val('');
		}
	});
};

/**
 * Calculates the number of videos to show per row.
 * 
 * @returns The number per row
 */
Room.prototype.getNumPerRow = function() {
	var len = this.videos.length;

	if (len == 1) {
		return 1;
	}

	var biggest;

	// Ensure length is even for better division.
	if (len % 2 === 1) {
		len++;
	}

	biggest = Math.ceil(Math.sqrt(len));
	while (len % biggest !== 0) {
		biggest++;
	}
	return biggest;
};

/**
 * Updates the position of all videos
 */
Room.prototype.subdivideVideos = function() {
	for ( var i = 0, len = this.videos.length; i < len; i++) {
		var video = $('#remote' + this.videos[i]);
		this.setWH(video, i);
	}
};

/**
 * Sets the size and position of a single video.
 * 
 * @param video
 *            The video to change
 * @param i
 *            The index of the video, will determine its position
 */
Room.prototype.setWH = function(video, i) {
	var perRow = this.getNumPerRow();
	var perColumn = Math.ceil(this.videos.length / perRow);
	var width = Math.floor($(window).innerWidth() / perRow);
	var height = Math.floor(($(window).innerHeight() - 31) / perColumn);
	video.width(width);
	video.height(height);
	video.css({
		position : 'absolute',
		left : (i % perRow) * width + 'px',
		top : Math.floor(i / perRow) * height + 'px'
	});
};

/**
 * Creates a video tag and adds it to the list.
 * 
 * @param socketId
 *            The id used for the video
 * @returns The newly created video
 */
Room.prototype.createVideo = function(socketId) {
	var video = $('<video/>', {
		id : 'remote' + socketId,
		autoplay : 'autoplay'
	});
	$('#videos').append(video);
	this.videos.push(socketId);
	return video;
};

/**
 * Removes the video with a given id
 * 
 * @param socketId
 *            The id to remove
 */
Room.prototype.removeVideo = function(socketId) {
	if ($('#remote' + socketId).length != 0) {
		$('#remote' + socketId).remove();
		this.videos.splice(this.videos.indexOf(socketId), 1);
	}
};

/**
 * Adds a message to the chat box
 * 
 * @param msg
 *            The message to add
 * @param blink
 *            True if you want the chat icon to blink
 */
Room.prototype.addToChat = function(msg, blink) {
	var index = msg.indexOf(':');
	var userName = '';
	var restMsg = msg;

	// Make user name bold
	if (index != -1) {
		userName = msg.substring(0, index + 1);
		restMsg = msg.substring(1 + index, msg.length);
	}

	$('#messages').append($('<span/>', {
		text : userName
	}).css({
		'padding-left' : '5px',
		'font-weight' : 'bold'
	})).append($('<span/>', {
		text : restMsg
	}).append('<br />'));
	$('#messages').scrollTop($('#messages')[0].scrollHeight);

	if (!this.chat_recent_blink && blink) {
		$('label[for=toggle_chat]', window.parent.document).effect('highlight');

		var self = this;
		this.chat_recent_blink = true;
		setTimeout(function() {
			self.chat_recent_blink = false;
		}, 1000);
	}
};

/**
 * Sends a chat message to the others in the room.
 * 
 * @param msg
 *            The message to send
 */
Room.prototype.writeMessageToChat = function(msg) {
	parent.socket.send(parent.API_MESSAGE_BROADCAST, JSON.stringify({
		'msg' : msg
	}));
	this.addToChat(msg, false);
};
