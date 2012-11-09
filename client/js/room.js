var room; // Global room object

// TODO Comments!

$(function() {
	if ($('#roomFrame', window.parent.document).length != 1) {
		window.location.replace('../');
		return;
	}
	
	room = new Room();
	room.init();	
});

function Room() {
	this.videos = [];
	this.chat_recent_blink = false; // Don't blink too often
	
	// These ones aren't used except for checking if the browser know what they are.
	this.PeerConnection = window.webkitRTCPeerConnection;
}

Room.prototype.init = function() {
	var self = this;
	
	$(window).resize(function() {
		self.subdivideVideos();
	});
	
	$('#chatbox').hide();
	
	if (this.PeerConnection) {
		rtc.createStream({'video': true, 'audio': true}, function(stream){
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
	rtc.connect('ws://'+ window.location.host +'/', roomId);

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
}

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
}

Room.prototype.subdivideVideos = function() {
	var perRow = this.getNumPerRow();
	for (var i = 0, len = this.videos.length; i < len; i++) {
		var video = $('#remote' + this.videos[i]);
		this.setWH(video, i);
	}
}

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
}

Room.prototype.createVideo = function(socketId) {
	var video = $('<video/>', {
		id : 'remote' + socketId,
		autoplay : 'autoplay'
	});
	$('#videos').append(video);
	this.videos.push(socketId);
	return video;
}

Room.prototype.removeVideo = function(socketId) {
	if ($('#remote' + socketId).length != 0) {
		$('#remote' + socketId).remove();
		this.videos.splice(this.videos.indexOf(socketId), 1);
	}
}

Room.prototype.addToChat = function(msg, blink) {
	var index = msg.indexOf(':');
	var userName = '';
	var restMsg = msg;
	
	// Make user name bold
	if (index != -1) {
		userName = msg.substring(0, index+1);
		restMsg = msg.substring(1+index, msg.length);
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
}

Room.prototype.writeMessageToChat = function(msg) {
	parent.socket.send(parent.API_MESSAGE_BROADCAST, JSON.stringify({
		'msg' : msg
	}));
	this.addToChat(msg, false);
}
