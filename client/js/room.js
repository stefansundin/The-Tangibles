$(function() {
	// Function that starts all the things we need
	init();	
});
	
var videos = [];
//var rooms = [1,2,3,4,5]; IF SOMETHING ISN'T WORKING, TRY ENABLING THIS ONE.

// These ones aren't used except for checking if the browser know what they are.
//var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection;
var PeerConnection = window.webkitRTCPeerConnection;
        
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
		var video = videos[i];
		setWH(video, i);
		numInRow = (numInRow + 1) % perRow;
	}
}

function setWH(video, i) {
	var perRow = getNumPerRow();
	var perColumn = Math.ceil(videos.length / perRow);
	var width = Math.floor((window.innerWidth) / perRow);
	var height = Math.floor((window.innerHeight - 31) / perColumn);
	video.width = width;
	video.height = height;
	video.style.position = "absolute";
	video.style.left = (i % perRow) * width + "px";
	video.style.top = Math.floor(i / perRow) * height + "px";
}

function cloneVideo(domId, socketId) {
	var video = document.getElementById(domId);
	var clone = video.cloneNode(false);
	clone.id = "remote" + socketId;
	document.getElementById('videos').appendChild(clone);
	videos.push(clone);
	return clone;
}

function removeVideo(socketId) {
	var video = document.getElementById('remote' + socketId);
	if (video) {
		videos.splice(videos.indexOf(video), 1);
		video.parentNode.removeChild(video);
	}
}

function addToChat(msg, color) {
	var messages = document.getElementById('messages');
	msg = sanitize(msg);
	if (color) {
		msg = '<span style="color: ' + color + '; padding-left: 5px">' + msg + '</span>';
	} else {
		msg = '<span style="padding-left: 5px">' + msg + '</span>';
	}
	messages.innerHTML = messages.innerHTML + msg + '<br>';
	messages.scrollTop = 10000;
}

function sanitize(msg) {
	return msg.replace(/</g, '&lt;');
}

function writeMessageToChat(message) {
	var room = window.location.hash.slice(1);
	var color = "#"+((1<<24)*Math.random()|0).toString(16);

	parent.socket.send(
				parent.API_MESSAGE_BROADCAST, 
				JSON.stringify({
					"msg" : message
			}));
	addToChat(message);
/*	parent.socket.send(JSON.stringify({
		"eventName": "chat_msg",
		"data": {
		"messages": message,
		"room": room,
		"color": color
		}
	}), function(error) {
			if (error) {
				console.log(error);
			}
	}); 
	addToChat(message); */
}

function initChat() {
	var input = document.getElementById("chatinput");
	var room = window.location.hash.slice(1);
	var color = "#"+((1<<24)*Math.random()|0).toString(16);

	input.addEventListener('keydown', function(event) {
		var key = event.which || event.keyCode;
		var msg = parent.lobby.ownName + '> ' + input.value;

		if (key === 13) {
			parent.socket.send(
				parent.API_MESSAGE_BROADCAST, 
				JSON.stringify({
					"msg" : msg
			}));
			addToChat(msg);
			input.value = "";
		}
	}, false);
	parent.socket.on(parent.API_MESSAGE, function(clientID, msg) {
		addToChat(msg);
	});
}

function init() {
	if ($(window.parent.document).find("#roomFrame").length == 0) {
		console.log("Attempted to access this page without going through the lobby.");
		//window.location.replace("http://www.youtube.com/watch?v=_1mB5rM8WHU");
		window.location.replace("index.html");
	} else {
		initRoom();
	}
}
	  
function initRoom() {
    $('#chatbox').hide(); //TODO: Flytta p� den h�r.
	
	if(PeerConnection){

		rtc.createStream({"video": true, "audio": true}, function(stream) {
			document.getElementById('you').src = URL.createObjectURL(stream);
			videos.push(document.getElementById('you'));
			rtc.attachStream(stream, 'you');
			subdivideVideos();
		});
	}else {
		alert('You are not using a browser with webkitRTCPeerConnection support. Either use Canary or wait for Chrome to be updated.');
	}
	var room = window.location.hash.slice(1);
//	parent.window.parent.document.title = 'Room: ' + room;

	console.log('Connecting to websocket');
	rtc.connect("ws://"+ window.location.host +"/", room);

	rtc.on('add remote stream', function(stream, socketId) {
		console.log("ADDING REMOTE STREAM...");
		var clone = cloneVideo('you', socketId);
		document.getElementById(clone.id).setAttribute("class", "");
		rtc.attachStream(stream, clone.id);
		subdivideVideos();
	});
	rtc.on('disconnect stream', function(data) {
		console.log('remove ' + data);
		removeVideo(data);
		subdivideVideos();
	});
	  
	initChat();
}
    
window.onresize = function(event) {
    subdivideVideos();
};