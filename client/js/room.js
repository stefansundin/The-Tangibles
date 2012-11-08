
// TODO Convert code to prototype!

var videos = [];
var chat_recent_blink = false; // Don't blink too often

// These ones aren't used except for checking if the browser know what they are.
var PeerConnection = window.webkitRTCPeerConnection;

$(function() {
	if ($('#roomFrame', window.parent.document).length != 1) {
		window.location.replace('../');
		return;
	}
	
	// Function that starts all the things we need
	init();	
});

function init() {
	$(window).resize(function() {
		subdivideVideos();
	});
	
	$('#chatbox').hide();
	
	if (PeerConnection) {
		rtc.createStream({'video': true, 'audio': true}, function(stream){
			// TODO Maybe show a small video of self
		});
	} else {
		alert('You are not using a browser with webkitRTCPeerConnection support. Either use Canary or wait for Chrome to be updated.');
	}
	var room = window.location.hash.slice(1);

	console.log('Connecting to websocket');
	rtc.connect('ws://'+ window.location.host +'/', room);

	rtc.on('add remote stream', function(stream, socketId) {
		console.log('ADDING REMOTE STREAM...');
		var video = createVideo(socketId);
		rtc.attachStream(stream, video.attr('id'));
		subdivideVideos();
		
		$('#empty_message').hide();
	});
	rtc.on('disconnect stream', function(data) {
		console.log('remove ' + data);
		removeVideo(data);
		subdivideVideos();
		
		if (videos.length == 0) {
			$('#empty_message').show();
		}
	});
	
	parent.socket.on(parent.API_MESSAGE, function(clientID, msg) {
		addToChat(msg, true);
	});
	
	$('#chatinput').keypress(function(e) {
		if (e.which == 13) {
			var msg = $(this).val();
			if (msg.length > 0) {
				writeMessageToChat(parent.lobby.ownName + ': ' + msg);
			}
			$(this).val('');
		}
	});
}

function getNumPerRow() {
	var len = videos.length;
	
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

function subdivideVideos() {
	var perRow = getNumPerRow();
	var numInRow = 0;
	for (var i = 0, len = videos.length; i < len; i++) {
		var video = $('#remote' + videos[i]);
		setWH(video, i);
		numInRow = (numInRow + 1) % perRow;
	}
}

function setWH(video, i) {
	var perRow = getNumPerRow();
	var perColumn = Math.ceil(videos.length / perRow);
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

function createVideo(socketId) {
	var video = $('<video/>', {
		id : 'remote' + socketId,
		autoplay : 'autoplay'
	});
	$('#videos').append(video);
	videos.push(socketId);
	return video;
}

function removeVideo(socketId) {
	if ($('#remote' + socketId).length != 0) {
		$('#remote' + socketId).remove();
		videos.splice(videos.indexOf(socketId), 1);
	}
}

function addToChat(msg, blink) {
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
	
	if (!chat_recent_blink && blink) {
		$('label[for=toggle_chat]', window.parent.document).effect('highlight');
		
		chat_recent_blink = true;
		setTimeout(function() {
			chat_recent_blink = false;
		}, 1000);
	}
}

function writeMessageToChat(msg) {
	parent.socket.send(parent.API_MESSAGE_BROADCAST, JSON.stringify({
		'msg' : msg
	}));
	addToChat(msg, false);
}
