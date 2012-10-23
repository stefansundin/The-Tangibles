//#!/usr/bin/env node


function socketserver(){
	
	var WebSocketServer = require('websocket').server;
	var http = require('http')
	
	
	/*
	 * TODO: 
	 * 		calls: timer for timeout 
	 * 
	 * 		enter rooms: when a user enters lobbyn at a later time, the list is incomplete. < Needs test
	 * 
	 * 
	 * 
	 */
	
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Constants
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	var PORT_NUMBER = 12345;
	
	var API_USER_ENTER = "userenter";
	var API_USER_LEAVE = "userleave";
	var API_ROOM_ENTER = "roomenter";
	var API_ROOM_LEAVE = "roomleave";
	
	var API_LIST_ROOMS = "listrooms";
	var API_LIST_USERS = "listusers";
	var API_LIST = "listall";
	
	var API_USER_CHANGE = "userchange" 
	var API_USER_NEW = "useradd";
	var API_USER_REMOVE = "userremove";
	var API_ROOM_NEW = "roomadd";
	var API_ROOM_REMOVE = "roomremove";
	
	var API_INVITE_SEND = "invitesend";
	var API_INVITE_ANSWER = "inviteanswer";
	var API_INVITE_LEAVE = "inviteleave";
	var API_INVITE_TIMEOUT = "invitetimeout";
	var API_INVITE_ACCEPTED = "inviteroom";
	var API_INVITE_DECLINED = "declineroom";
	
	var API_MESSAGE = "msg";
	var API_MESSAGE_BROADCAST = "msgbroadcast";
	
	var API_CORNERS = "corners";
	var API_CORNERS_BROADCAST = "cornersbroadcast";
	
	var API_NAME_SET = "setname";
	var API_NAME_CHANGE = "changename";
	
	var API_ECHO = "echo";
	
	var ROOM_PUBLIC = "public";
	var ROOM_PRIVATE = "private";
	var ROOM_PASSWORD = "password";
	
	
	var LIMIT_ROOMS = 1000;
	var LIMIT_CALLS = 1000;
	var LIMIT_USERS = 1000; 
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Propotype
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	Array.prototype.remove=function(key) {
		this.splice(this.indexOf(key), 1);	
	}
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Lists of objects
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	var lRooms = [];
	var lUsers = [];
	var lCalls = [];
	
	
	
	var counterRoom = 0;
	function getNextRoomId(){
		return counterRoom++;
	}
	
	var counterUser = 0;
	function getNextUserId(){
		return counterUser++;
	}
	
	var counterCall = 0;
	function getNextCallId(){
		return counterCall++;
	}
	
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Message callback
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	var callbacks = {};
	
	function addCallbacks(event_name, callback) {
		callbacks[event_name] = callbacks[event_name] || [];
		callbacks[event_name].push(callback);
	}
	
	function fire(event_name, client, message) {
		console.log((new Date()) + " Firing: " + event_name);
		console.log((new Date()) + " Message: " + message);
		var chain = callbacks[event_name];
		if (typeof chain == 'undefined') 
			return; // no callbacks for this event
		
		var obj = [];
		if (message != ""){
			obj = JSON.parse(message);
		} 
		
		for (var i = 0; i < chain.length; i++) {
			if (typeof(chain[i]) === 'function') {
				
				var args = [];
				args.push(client);
				for (j in obj) {
					args.push(obj[j]);
				}
				
				chain[i].apply (null, args);
				//chain[i] (client, message);	
			} else {
				console.log((new Date()) + " not a function: ");
				console.log(typeof(chain[i]));
				console.log(chain[i]);
			}
		}
	}
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Server
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	var server = http.createServer(function(request,response) {
		// process HTTP request. Since we're writing just WebSockets server
	    // we don't have to implement anything.
	});
	
	server.listen(PORT_NUMBER, function() {});
	
	wsServer = new WebSocketServer({
		httpServer: server,
		// You should not use autoAcceptConnections for production
	    // applications, as it defeats all standard cross-origin protection
	    // facilities built into the protocol and the browser. You should
	    // *always* verify the connection's origin and decide whether or not
	    // to accept it.
	    autoAcceptConnections: false
	});
	
	function originIsAllowed(origin) {
	  // put logic here to detect whether the specified origin is allowed.
	  return true;
	}
	
	wsServer.on('request', function(request) {
		if (!originIsAllowed(request.origin)) {
	      // Make sure we only accept requests from an allowed origin
	      request.reject();
	      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
	      return;
	    }
		
		var connection = request.accept('tangibles', request.origin);
		console.log((new Date()) + ' Connection accepted from ip ' + connection.remoteAddress);
	
		connection.on('message', function(message) {
			if (message.type === 'utf8') {
				var json = JSON.parse(message.utf8Data);
				fire(json.event, connection, json.data);	
			}
		});
		
		connection.on('close', function(reasonCode, description) {
	        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	        connectionClosed(connection);
	    });
	    
	    handleNewConnection(connection);
	});
	
	/**
	 * Handling a new connection, adding it to the lobby. NOT notifying those
	 * already in the lobby (wait until the name has been chosen).
	 * 
	 * @param connection
	 *            Socket
	 */
	function handleNewConnection(connection){
		//var room = getRoomById(0);
		//room.addUser(new _user(connection));
		

		// TODO: Jonas dethär händer ofta
		// TODO: Jonas dethär händer ofta
		// TODO: Det händer då man accepter/declinar ett call som inte finns
		//node.js:201
		//        throw e; // process.nextTick error, or 'error' event on first tick
		//              ^
		//Error: listen EACCES
		//    at errnoException (net.js:646:11)
		//    at Array.0 (net.js:732:28)
		//    at EventEmitter._tickCallback (node.js:192:41)

		
		addNewUser(connection);
		
	}
	
	/**
	 * Handling when a connection is reset (closed). Notify all users in the room
	 * the leaving user was last seen in.
	 * 
	 * @addon TODO Should lobbyn also be notified? (if the users always should be
	 *        seen there but with a status symbol)
	 * @param connection
	 *            Socket
	 */
	function connectionClosed(connection){
		
		var user = getUserBySocket(connection);
		
		if (user == null) {
			console.log("User not found");
			// TODO: check if therer are two different kinds of connection closed.
			return;
		}
		
		if (user.roomId != -1) {
			var room = getRoomById(user.roomId);
			
			removeUser(user);
			
			var data = JSON.stringify({
				id: user.id
			});
			
			//sendMessageToRoom(user.id, user.roomId, API_USER_LEAVE, data);
			sendMessageToAll(API_USER_LEAVE, data);
			
			if (user.inCall){
				sendMessageToRoom(user.id, user.roomId, API_INVITE_LEAVE, data);	
			}
		}
		
		// var roomOld = getRoomByUserSocket(connection);
		// var user = roomOld.getUserBySocket(connection);
	// 	
		// roomOld.removeUser(user);
	// 	
		// var name = user.name;
	// 	
		// for ( var i = 0; i < roomOld.users.length; i++) {
			// if (roomOld.users[i] != null) {
				// sendMessage(roomOld.users[i].socket, API_USER_LEAVE, name);	
			// }
		// }
	
	}
	
	/**
	 * Send a message to a socket.
	 * 
	 * @param connection
	 *            WebSocket to send to
	 * @param event_name
	 *            Event name of the message
	 * @param event_data
	 *            Message payload
	 */
	function sendMessage(connection, event_name, event_data) {
		var payload = JSON.stringify({
			event: event_name, 
			data: event_data
		});
		
		console.log((new Date()) + " send message: " + payload);
		
		connection.send(payload); // <= send JSON data
	}
	
	function sendMessageToRoom(userId, roomId, event_name, event_data){
		for(var i=0,j=lUsers.length; i<j; i++){
			if (lUsers[i].roomId == roomId) {
				if (lUsers[i].id != userId){
					sendMessage(lUsers[i].socket, event_name, event_data);	
				}
			}
		};
	}
	
	function sendMessageToAllButSelf(id,event_name, event_data){
		for(var i=0,j=lUsers.length; i<j; i++){
			if (lUsers[i].id != id){
				sendMessage(lUsers[i].socket, event_name, event_data);	
			}
		};
	}
	
	function sendMessageToAll(event_name, event_data){
		for(var i=0,j=lUsers.length; i<j; i++){
			sendMessage(lUsers[i].socket, event_name, event_data);	
		};
	}
	
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Handle message
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	/**
	 * Change the name of a user based on the connection, i.e. only the owner of the socket can change it's name. 
	 * 
	 * @param con
	 * 		Websocket connection
	 * @param name
	 *  	New name
	 */
	addCallbacks(API_NAME_SET, function (con, name){
		var user = getUserBySocket(con);
		var room = getRoomById(user.roomId);
		
		var oldName = user.name;
		
		user.setName(name); // Changing the room to looby also
		
		var data = JSON.stringify({
			name: user.name,
		}); 
		
		sendMessage(con, API_NAME_SET, data);	
		
		if (oldName == ""){
			var data = JSON.stringify({
				id: user.id,
				name: user.name,
				roomId: user.roomId
			}); 
			//sendMessageToAllButSelf(user.id, API_USER_ENTER, data);
			sendMessageToAll(API_USER_ENTER, data);
		} else {
			var data = JSON.stringify({
				id: user.id,
				name: user.name
			}); 
			//sendMessageToAllButSelf(user.id, API_NAME_CHANGE, data);
			sendMessageToAll(API_NAME_CHANGE, data);
		}
		
	});
	
	/**
	 * Request a list of all rooms and users. 
	 * 
	 * @param con
	 * 		Websocket connection
	 */
	addCallbacks(API_LIST, function(con){
		var listRooms = [];
		var listUsers = [];		
		
		for(var i=0,j=lRooms.length; i<j; i++){
			var r = lRooms[i];
			console.log(r)
			listRooms.push([r.id, r.name, r.desc, r.type]);
		};
		
		for(var i=0,j=lUsers.length; i<j; i++){
			var u = lUsers[i];
			if (u.roomId != -1 && u.name != "") {
				listUsers.push([u.id, u.name, u.roomId]);	
			}
		};
	
		var data = JSON.stringify({
			rooms: listRooms,
			users: listUsers
		});
		
		sendMessage(con, API_LIST, data);
	});
	
	/**
	 * Move between two rooms, notifying the leaving room with a API_USER_LEAVE event and the entering room with a API_USER_ENTER
	 * 
	 * @param con
	 * 		Websocket connection
	 * @param newRoomId
	 *  	The if of the room to move to
	 */
	addCallbacks(API_USER_CHANGE, function(con, newRoomId){
		
		var user = getUserBySocket(con);
		var room = getRoomById(user.roomId);
		
		console.log("%%%%");
		console.log(user.id);
		
		var data = JSON.stringify({
			id: user.id
		}); 
		
		if (user.name != "" && user.roomId != -1) {
			//sendMessageToRoom(user.id, user.roomId, API_USER_LEAVE, data);
			sendMessageToAll(API_USER_LEAVE, data);
			
			if (user.inCall){
				sendMessageToRoom(user.id, user.roomId, API_INVITE_LEAVE, data);
				//TODO: change user to not in call anymore?	
			}
		}
		user.roomId = newRoomId;
		
		var data = JSON.stringify({
			id: user.id,
			name: user.name,
			roomId: user.roomId
		}); 
		
		//sendMessageToRoom(user.id, newRoomId, API_USER_ENTER, data);
		sendMessageToAll(API_USER_ENTER, data);
	});
	
	/**
	 * Send a message to a recipient. 
	 * 
	 * @param con
	 * 		Websocket connection
	 * @param recipientId
	 *  	The id of the recipient
	 * @param message
	 * 		Message to deliver to the recipient
	 */
	addCallbacks(API_MESSAGE, function(con, recipientId, message){
		
		var recipient = getUserById(recipientId);
		
		var data = JSON.stringify({
			msg: message
		});
		
		sendMessage(API_MESSAGE, recipient.socket, data);
	});
	
	/**
	 * Send a message to all users in the current room. 
	 * (do we want to differentiate between broadcast or not?) 
	 * 
	 * @param con
	 * 		Websocket connection
	 * @param message
	 * 		Message to deliver to the recipients
	 */
	addCallbacks(API_MESSAGE_BROADCAST, function(con, message){
		
		var recipients = getUserBySocket(con);
		
		var data = JSON.stringify({
			sender: recipients.id,
			msg: message
		});
		
		sendMessageToRoom(recipients.id, recipients.roomId, API_MESSAGE, data);
	});
	
	/**
	 * Send a API_CORNERS to an recipient, notifying it of the new corners for use by the projector. 
	 * 
	 * @param con
	 * 		Websocket connection
	 * @param recipientId
	 *  	The id of the recipient
	 * @param message
	 * 		Message to deliver to the recipient
	 */
	addCallbacks(API_CORNERS, function(con, recipientId, message, label){
		
		var recipient = getUserById(recipientId);
		
		var data = JSON.stringify({
			msg: message,
			videoLabel: label
		});
		
		sendMessage(API_CORNERS, recipient.socket, data);
	});
	
	/**
	 * Send a API_CORNERS_BROADCAST to all users in the current room, notifying the users of the new corners for use by the projector. 
	 * 
	 * @param con
	 * 		Websocket connection
	 * @param message
	 *  	Message to deliver to the recipients
	 */
	addCallbacks(API_CORNERS_BROADCAST, function(con, message, label){
		
		var recipients = getUserBySocket(con);
		
		console.log(message);
		
		var data = JSON.stringify({
			sender: recipients.id,
			msg: message, 
			videoLabel: label
		});
		
		sendMessageToRoom(recipients.id, recipients.roomId, API_CORNERS_BROADCAST, data);
	});
	
	
	addCallbacks(API_INVITE_SEND, function(con, recipientId, roomId){
		if (roomId < 1) {
			return null;
		}
		
		var caller = getUserBySocket(con);
		var recipient = getUserById(recipientId);
		var room = getRoomById(roomId);
			
			
		var call = createNewCall(caller, recipient, roomId);
		
		console.log("########");
		
		
		console.log("# Room:");
		console.log(room);
		
		console.log("########");
	
		if (caller == null || recipient == null || room == null){
			return;
		}
		
		var data = JSON.stringify({
			name: caller.name,
			roomName: room.name,
			callId: call.id
		});
		
		sendMessage(recipient.socket, API_INVITE_SEND, data);
	});
	
	
	addCallbacks(API_INVITE_ANSWER, function(con, callId, answer){
		var call = getCallById(callId);
		
		if (call == null) {
			console.log((new Date()) + " call is null, stop hacking! " + con.remoteAddress);
			return;
		}
		
		var data = JSON.stringify({
			id: call.called.id,
			answer: answer
		});
		
		sendMessage(call.caller.socket, API_INVITE_ANSWER, data);
		
		console.log("Answer: " + answer);
		
		if (answer == "yes") {
			call.caller.inCall = true;
			call.called.inCall = true;
			
			var data = JSON.stringify({
				roomId: call.roomId 
			}); 
			
			if (call.called.socket == con) {
				console.log("same");
			} else {
				console.log("not same");
			}
			
			sendMessage(con, API_INVITE_ACCEPTED, data);
			
		} else { // answer = no
			sendMessage(con, API_INVITE_DECLINED, JSON.stringify({
				id : callId
			}));
		}
		
		
		
	});
	
	
	addCallbacks(API_ROOM_NEW, function(con, name, typeS, desc, pass){
		
		if (desc == null) {
			desc = ""
		}
		
		if (pass == null) {
			pass = ""
		}
		
		var roomId = createNewRoom(name, typeS, desc, pass);
		
		console.log(lRooms)
		
		var data = JSON.stringify({
			id: roomId,
			name: name,
			desc: desc,
			type: typeS
		});
		
		//TODO: Callback to creator (if want to go into room directly)
		
		sendMessageToAll(API_ROOM_NEW, data);
	});
	
	addCallbacks(API_ROOM_REMOVE, function(con, id){
		
		if (id == 0){
			console.log((new Date()) + " trying to remove lobby...");
			return;
		}
		
		
		for(var i=0,j=lUsers.length; i<j; i++){
			if (lUsers[i].roomId == id) {
				console.log((new Date()) + " trying to remove non-empty room");
				return;
			}
		};
		
		removeRoomById(id);
		
		var data = JSON.stringify({
			id: id
		});
		
		sendMessageToAll(API_ROOM_REMOVE, data);
	});
	
	
	addCallbacks(API_ECHO, function(con, message){
		
		var data = JSON.stringify({
			msg: message
		});
		
		sendMessage(con, API_ECHO, data);
	});
	
	/*
	addCallbacks(, function(con, ){
		
	});
	TODO: CALLBACKS
	 */
	
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Startup
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	function startup(){
		// Create looby (gets ID 0)
		createNewRoom("Lobby", ROOM_PUBLIC, "Da LOBBY!!!!!", "");
	
		// Create some public test rooms
		createNewRoom("From", ROOM_PUBLIC, "", "");
		createNewRoom("Paris", ROOM_PUBLIC, "", "");
		createNewRoom("To", ROOM_PUBLIC, "", "");
		createNewRoom("Berlin", ROOM_PUBLIC, "", "");	
	}
	
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Objects
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	function obj_user(socket) {
		this.id = getNextUserId();
		this.name = "";
		this.roomId = -1;
		this.socket = socket;
		this.inCall = false;
		
		this.setName = function(name){
			this.name = name;
			if (this.roomId == -1) {
				this.roomId = 0; // Always join lobby if the user is not in a room previously.
			}
		}
	}
	
	function obj_room(name, typeS, desc, pass) {
		this.id = getNextRoomId();
		this.name = name;
		this.type = typeS;
		this.pass = pass; // maybe not yet?
		this.desc = desc; // not necissary
	}
	
	
	function obj_call(caller, called, roomId){
		this.id = getNextCallId();
		this.caller = caller;
		this.called = called;
		this.roomId = roomId;
	}
	
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Room logic
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	function createNewRoom(name, typeS, desc, pass){
		if (lRooms.length > LIMIT_ROOMS){
			return;
		}
		var room = new obj_room(name, typeS, desc, pass);
		lRooms.push(room);
		return room.id;
	}
	
	function removeRoomById(id){
		if (id != 0) {
			var room = getRoomById(id);
			lRooms.remove(room);	
		}
	}
	
	function getRoomByName(name) {
		for(var i=0,j=lRooms.length; i<j; i++){
			if (lRooms[i].name == name) {
				return lRooms[i];	
			}
		};
	}
	
	function getRoomById(id) {
		for(var i=0,j=lRooms.length; i<j; i++){
			if (lRooms[i].id == id) {
				return lRooms[i];	
			}
		};
	}
	
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// User logic
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	function addNewUser(socket){
		if (lUsers.length > LIMIT_USERS){
			return;
		}
		lUsers.push(new obj_user(socket));
	}
	
	function removeUserById(id){
		for(var i=0,j=lUsers.length; i<j; i++){
			if (lUsers[i].id == id) {
				removeUser(lUsers[i]);
			}
		};
	}
	
	function removeUser(user){
		lUsers.remove(user);
	}
	
	function getUserBySocket(socket) {
		for(var i=0,j=lUsers.length; i<j; i++){
			if (lUsers[i].socket == socket) {
				return lUsers[i];	
			}
		};
	}
	
	function getUserById(id) {
		for(var i=0,j=lUsers.length; i<j; i++){
			if (lUsers[i].id == id) {
				return lUsers[i];	
			}
		};
	}
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// 						Call logic
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	function createNewCall(caller, called, roomId){
		if (lCalls.length > LIMIT_CALLS){
			return;
		}
		var call = new obj_call(caller, called, roomId);
		lCalls.push(call);
		return call;
	}
	
	function getCallById(id) {
		for(var i=0,j=lCalls.length; i<j; i++){
			if (lCalls[i].id == id) {
				return lCalls[i];	
			}
		};
	}
	
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// 						
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	
	startup();
	
}

//var S = new socketserver();

module.exports.socketserver = socketserver;