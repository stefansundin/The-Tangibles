$(function() {
	init();
    $('#dialog').dialog({
        autoOpen : false,
        modal : true,
		buttons: {
			Ok: function() {
			//	console.log('All users: ' + ulist);			
				$(this).find('input[type="checkbox"]').each(function(){
					if($(this).is(':checked')){
						uid = $(this).attr('id');
						ulist = parent.lobby.users;
						console.log('User id: ' + uid);
						
						
						for (i in ulist) {
							if(ulist[i][0] == uid) {
								console.log('Found user: ' + ulist[i][1]);
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

    $("button#openDialog").click(function() {
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
		$('#dialog').dialog('open');
	});
});
	
      var videos = [];
      var rooms = [1,2,3,4,5];
      var PeerConnection = window.PeerConnection || window.webkitPeerConnection00;
      var user_name = parent.lobby.ownName;
      
      // State variable used to keep track of what to show.
      var state = "lobby";
        
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

      function initFullScreen() { 
        var button = document.getElementById("fullscreen");
        button.addEventListener('click', function(event) {
          var elem = document.getElementById("videos"); 
          //show full screen 
          elem.webkitRequestFullScreen();
        });
      } 

      function initNewRoom() {
        var button = document.getElementById("newRoom");
        //button.disabled = true;
        button.addEventListener('click', function(event) {

            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var string_length = 8;
            var randomstring = '';
            for (var i=0; i<string_length; i++) {
              var rnum = Math.floor(Math.random() * chars.length);
              randomstring += chars.substring(rnum,rnum+1);
            }
            
            window.location.hash = randomstring;
            location.reload();
        })
      }
	  
	  function initOpenWorkspace() {
		var wsbutton = document.getElementById("openWorkspace");
		wsbutton.addEventListener('click', function(event){
			var clbutton = document.getElementById("closeWorkspace");
			clbutton.disabled = false;
			wsbutton.disabled = true;
			var room = window.location.hash.slice(1);
			workspaceWindow=window.open('/workspace/#' + room + '_desk');
      writeMessageToChat(user_name + " opened the workspace.");
    })
	  }
	  
	  function initCloseWorkspace() {
      var clbutton = document.getElementById("closeWorkspace");
      clbutton.disabled = true;
      clbutton.addEventListener('click', function(event){
        workspaceWindow.close();
        var wsbutton = document.getElementById("openWorkspace");
        wsbutton.disabled = false;
        clbutton.disabled = true;
      })
	  }
	  
	function onUserInvited(invited_user) {
	    var inviting_user = parent.lobby.ownName;
		var room = window.location.hash.slice(1);
      
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
			uid = -2;
		}
	
		// If the user exists:
		if (uid > -1) {
			parent.socket.send(parent.API_INVITE_SEND, JSON.stringify({
				id:uid,
				roomId:room
			}));
			writeMessageToChat(inviting_user + ' invited ' + invited_user);
			console.log('The user ' + invited_user + '(id:'+uid+') was invited by ' + inviting_user + ' to this room (' + room + ')');
      
		// If the user does not exist:
		} else if (uid == -2) {
			addToChat("Stop inviting yourself " + inviting_user + "...");
		} else {
			addToChat("User " + invited_user + " does not exist.");
		}
	}
	  
	  function initInviteUser() {
/*      var inviteButton = document.getElementById("inviteUser");
      inviteButton.addEventListener('click', function(event) {
		var userlist = [];
		var list = parent.lobby.users;
		for (i in list) {
			if (list[i][1] != parent.lobby.ownName) {
				userlist.push(list[i][1]);
			}
		}
        var invited_user = prompt("Enter user to invite: " + userlist, "User");
        if (invited_user != '' && invited_user != null) {
          onUserInvited(invited_user);
        }
      }) */
	  }
	  
	  function initLeaveRoom() {
	    var leaveButton = document.getElementById("leaveRoom");
      leaveButton.addEventListener('click', function(event) {
        writeMessageToChat(user_name + " left the room.");
        console.log('Left the room');
		parent.window.parent.document.title = 'The-Tangibles';
        parent.lobby.leaveRoom();
      })
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
      if ($(window.parent.document).find("#roomMain").length == 0) {
        console.log("Attempted to access this page without going through the lobby.");
        //window.location.replace("http://www.youtube.com/watch?v=_1mB5rM8WHU");
        initRoom();
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
      //When using localhost
      console.log('Connecting');
      rtc.connect("ws://"+ window.location.host +"/", room);
      //rtc.connect("ws://localhost:8000/", room);
	  
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
      initFullScreen();
      //initNewRoom();
      initChat();
      initOpenWorkspace();
      initCloseWorkspace();
      initInviteUser();
      initLeaveRoom();
    }
    
    window.onresize = function(event) {
      subdivideVideos();
    };