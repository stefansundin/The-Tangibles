$(function() {
	// Function that starts all the things we need
	init();
	
	// Dialogs
	
    $('#invite_dialog').dialog({
        autoOpen : false,
        modal : true,
		buttons: {
			Ok: function() {		
				$(this).find('input[type="checkbox"]').each(function(){
					if($(this).is(':checked')){
						uid = $(this).attr('id');
						ulist = parent.lobby.users;
						for (i in ulist) {
							if(ulist[i][0] == uid) {
								onUserInvited(ulist[i][1]);
								break;
							}
						}
					}
				})
				document.getElementById('formContainer').innerHTML = "";
				$( this ).dialog( 'close' );
			},
			Cancel: function() {
				document.getElementById('formContainer').innerHTML = "";
				$( this ).dialog( 'close' );
			}
        }
    });
	
	$('#userlist_dialog').dialog({
        autoOpen : false,
        modal : true,
		buttons: {
			Ok: function() {
				$( this ).dialog( 'close' );
				document.getElementById('userlistContainer').innerHTML = "";
			}
		}
	});
	
	// Buttons that open dialogs
	
	$('#openInviteDialog').button().click(function() {
		var userlist = [];
		var list = parent.lobby.users;
		for (i in list) {
			if (list[i][1] != parent.lobby.ownName) {
				userlist.push(list[i]);
			}
		}
		
		for (i in userlist) {
			var node = document.createElement('div');        
			node.innerHTML = '<input type="checkbox" id="' + userlist[i][0] + '" name="' + userlist[i][0] + '"><label for="check' + userlist[i][0] + '">'+ userlist[i][1] +'</label>';       
			document.getElementById('formContainer').appendChild(node);
		}
		$('#invite_dialog').dialog('open');
	});
	
	$('#openUserListDialog').button().click(function() {
		var userlist = [];
		var list = parent.lobby.users;
		for (i in list) {
			userlist.push(list[i]);	
		}
		
		for (i in userlist) {
			var node = document.createElement('div');        
			node.innerHTML = '<p>' + userlist[i][1] + '</p>';       
			document.getElementById('userlistContainer').appendChild(node);
		}
		$('#userlist_dialog').dialog('open');
	});
	
	// Other buttons
	
	$('#leaveRoom').button().click(function() {
		writeMessageToChat(parent.lobby.ownName + " left the room.");
		console.log('Left the room');
		parent.window.parent.document.title = 'The-Tangibles';
		parent.lobby.leaveRoom();
	});
	
	$('#fullscreen').button().click(function() {
		var elem = document.getElementById("videos"); 
		//show full screen 
		elem.webkitRequestFullScreen();
	});
	
	var isOpen = false;
	var workspaceWindow = "";
	
	$('#openWorkspace').button().click(function() {
		if(isOpen) {
			workspaceWindow.close();
			writeMessageToChat(parent.lobby.ownName + " closed the workspace.");
			isOpen = false;
		} else {
			var room = window.location.hash.slice(1);
			workspaceWindow=window.open('/workspace/#' + room + '_desk');
			writeMessageToChat(parent.lobby.ownName + " opened the workspace.");
			isOpen = true;
		}
	});
	
});
	
var videos = [];
//var rooms = [1,2,3,4,5]; IF SOMETHING ISN'T WORKING, TRY ENABLING THIS ONE.

// These ones aren't used except for checking if the browser know what they are.
var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection;
      
function getNumPerRow() {
	var len = videos.length;
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
	var height = Math.floor((window.innerHeight - 190) / perColumn);
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
		msg = '<span style="color: ' + color + '; padding-left: 15px">' + msg + '</span>';
	} else {
		msg = '<strong style="padding-left: 15px">' + msg + '</strong>';
	}
	messages.innerHTML = messages.innerHTML + msg + '<br>';
	messages.scrollTop = 10000;
}

function sanitize(msg) {
	return msg.replace(/</g, '&lt;');
}
    
function onUserInvited(invited_user) {
	var inviting_user = parent.lobby.ownName;
	var room = window.location.hash.slice(1);
	
	// NOTE: These checks should not be needed as long as one only invites
	// through the invite dialog.
	
	// See if the user exists
	var uid = -1;
	var list = parent.lobby.users
	for (i in list) {
		if (list[i][1] == invited_user) {
			uid = list[i][0];
			break;
		}
	}
	// Check to see if the user invited himself
	if (invited_user == inviting_user) {
		addToChat("Stop inviting yourself " + inviting_user + "...");
		return;
	}
	// If the user exists:
	if (uid > -1) {
		parent.socket.send(parent.API_INVITE_SEND, JSON.stringify({
			id:uid,
			roomId:room
		}));
		writeMessageToChat(inviting_user + ' invited ' + invited_user);
		console.log('The user ' + invited_user + '(id:'+uid+') was invited by ' + inviting_user + ' to this room (' + room + ')');
	} else {
		addToChat("User " + invited_user + " does not exist.");
	}
}
	  
function writeMessageToChat(message) {
	var room = window.location.hash.slice(1);
	var color = "#"+((1<<24)*Math.random()|0).toString(16);

	rtc._socket.send(JSON.stringify({
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
	addToChat(message);
}

function initChat() {
	var input = document.getElementById("chatinput");
	var room = window.location.hash.slice(1);
	var color = "#"+((1<<24)*Math.random()|0).toString(16);

	input.addEventListener('keydown', function(event) {
		var key = event.which || event.keyCode;
		var msg = parent.lobby.ownName + '> ' + input.value;

		if (key === 13) {
			rtc._socket.send(JSON.stringify({
				"eventName": "chat_msg",
				"data": {
				"messages": msg,
				"room": room,
				"color": color
				}
			}), function(error) {
				if (error) {
					console.log(error);
				}
			});
			addToChat(msg);
			input.value = "";
		}
	}, false);
	rtc.on('receive_chat_msg', function(data) {
		console.log(data.color);
		addToChat(data.messages, data.color.toString(16));
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
      
	if(PeerConnection){

		rtc.createStream({"video": true, "audio": true}, function(stream) {
			document.getElementById('you').src = URL.createObjectURL(stream);
			videos.push(document.getElementById('you'));
			rtc.attachStream(stream, 'you');
			subdivideVideos();
		});
	}else {
		alert('Your browser is not supported or you have to turn on flags. In chrome you go to chrome://flags and turn on Enable PeerConnection remember to restart chrome');
	}
	var room = window.location.hash.slice(1);
	parent.window.parent.document.title = 'Room: ' + room;

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
	});
	  
	initChat();
}
    
window.onresize = function(event) {
    subdivideVideos();
};