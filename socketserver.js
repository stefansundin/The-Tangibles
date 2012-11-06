//#!/usr/bin/env node

/*
 *	TODO: Password protected rooms
 * 	TODO: Private rooms
 * 	TODO: openID
 * 	TODO: Making names on users unique
 * 	TODO: Making names on rooms unique
 * 	TODO: Merge calls when a user invites multiple users at the same time 
 *  (the client sends one call message for each invite)
 */
function socketserver() {

	var WebSocketServer = require('websocket').server;
	var http = require('http')

	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Constants
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

	var PORT_NUMBER = 12345;

	var API_USER_ENTER = "userenter";
	var API_USER_LEAVE = "userleave";
	var API_ROOM_ENTER = "roomenter";
	var API_ROOM_REFUSED = "roomrefused";

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
	var API_USERID = "userID";

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

	Array.prototype.remove = function(key) {
		this.splice(this.indexOf(key), 1);
	}
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Lists of objects
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

	var lRooms = [];
	var lUsers = [];
	var lCalls = [];

	var callbacks = {};
	// Contains functions

	var counterRoom = 0;
	var counterUser = 0;
	var counterCall = 0;

	/**
	 * Return the next id number for room
	 * @method getNextRoomId
	 */
	function getNextRoomId() {
		return counterRoom++;
	}

	/**
	 * Return the next id number for user
	 * @method getNextRoomId
	 */
	function getNextUserId() {
		return counterUser++;
	}

	/**
	 * Return the next id number for call
	 * @method getNextCallId
	 */
	function getNextCallId() {
		return counterCall++;
	}

	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Message callback
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

	/**
	 * Add functions to call when a specific event is triggerd
	 * @method addCallbacks
	 * @param event_name {String} Name of the event to react to
	 * @param callback {function} Function to call when reacting
	 */
	function addCallbacks(event_name, callback) {
		callbacks[event_name] = callbacks[event_name] || [];
		callbacks[event_name].push(callback);
	}

	/**
	 * Call specific function(s) that contains the specific event name
	 * @method fire
	 * @param event_name {String} Name of the event to react to
	 * @param client {WebSocket} Socket from client sending event
	 * @param message {JSON} JSON encoded string containing the parameters for the function TODO: change object to correct one
	 */
	function fire(event_name, client, message) {
		console.log((new Date()) + " Firing: " + event_name);
		console.log((new Date()) + " Message: " + message);
		var chain = callbacks[event_name];
		if ( typeof chain == 'undefined')
			return;
		// no callbacks for this event

		var obj = [];
		if (message != "") {
			obj = JSON.parse(message);
		}

		for (var i = 0; i < chain.length; i++) {
			if ( typeof (chain[i]) === 'function') {

				var args = [];
				args.push(client);
				for (j in obj) {
					args.push(obj[j]);
				}

				chain[i].apply(null, args);
				//chain[i] (client, message);
			} else {
				console.log((new Date()) + " not a function: ");
				console.log( typeof (chain[i]));
				console.log(chain[i]);
			}
		}
	}

	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Server
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

	var server = http.createServer(function(request, response) {
		// process HTTP request. Since we're writing just WebSockets server
		// we don't have to implement anything.
	});

	server.listen(PORT_NUMBER, function() {
	});

	wsServer = new WebSocketServer({
		httpServer : server,
		// You should not use autoAcceptConnections for production
		// applications, as it defeats all standard cross-origin protection
		// facilities built into the protocol and the browser. You should
		// *always* verify the connection's origin and decide whether or not
		// to accept it.
		autoAcceptConnections : false
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
	 * @method handleNewConnection
	 * @param connection Socket
	 */
	function handleNewConnection(connection) {
		var user = addNewUser(connection);

		if (user != null) {
			var data = JSON.stringify({
				id : user.id
			});

			sendMessage(connection, API_USERID, data);
		}
	}

	/**
	 * Handling when a connection is reset (closed). Notify all users in the room
	 * the leaving user was last seen in.
	 * @method connectionClosed
	 * @addon TODO Should lobbyn also be notified? (if the users always should be
	 *        seen there but with a status symbol)
	 * @param connection Socket
	 */
	function connectionClosed(connection) {

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
				id : user.id
			});

			//sendMessageToRoom(user.id, user.roomId, API_USER_LEAVE, data);
			sendMessageToAll(API_USER_LEAVE, data);

			if (user.inCall) {
				sendMessageToRoom(user.id, user.roomId, API_INVITE_LEAVE, data);
			}
		}
	}

	/**
	 * Send a message to a socket.
	 * @method sendMessage
	 * @param connection {websocket} the reciving socket
	 * @param event_name {String} Event name of the message
	 * @param event_data {JSONData} Message payload
	 */
	function sendMessage(connection, event_name, event_data) {
		var payload = JSON.stringify({
			event : event_name,
			data : event_data
		});

		console.log((new Date()) + " send message: " + payload);

		connection.send(payload);
		// <= send JSON data
	}

	/**
	 * Send a message to every person in a room.
	 * @method sendMessageToRoom
	 * @param userId {Int} the user sending the message
	 * @param roomId {Int} the room the user is sending the message to
	 * @param event_name {String} Event name of the message
	 * @param event_data {JSONData} Message payload
	 */
	function sendMessageToRoom(userId, roomId, event_name, event_data) {
		for (var i = 0, j = lUsers.length; i < j; i++) {
			if (lUsers[i].roomId == roomId) {
				if (lUsers[i].id != userId) {
					sendMessage(lUsers[i].socket, event_name, event_data);
				}
			}
		};
	}

	/**
	 * Send a message to every person exluding the sender.
	 * @method sendMessageToAllButSelf
	 * @param id {Int} the user sending the message
	 * @param event_name {String} Event name of the message
	 * @param event_data {JSONData} Message payload
	 */
	function sendMessageToAllButSelf(id, event_name, event_data) {
		for (var i = 0, j = lUsers.length; i < j; i++) {
			if (lUsers[i].id != id) {
				sendMessage(lUsers[i].socket, event_name, event_data);
			}
		};
	}

	/**
	 * Send a message to every person including the sender (for loopback functionality).
	 * @method sendMessageToAll
	 * @param event_name {String} Event name of the message
	 * @param event_data {JSONData} Message payload
	 */
	function sendMessageToAll(event_name, event_data) {
		for (var i = 0, j = lUsers.length; i < j; i++) {
			sendMessage(lUsers[i].socket, event_name, event_data);
		};
	}

	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Callbacks
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

	addCallbacks(API_NAME_SET, setName);

	addCallbacks(API_LIST, list);

	addCallbacks(API_USER_CHANGE, userChange);

	addCallbacks(API_MESSAGE, message);

	addCallbacks(API_MESSAGE_BROADCAST, messageBroadcast);

	addCallbacks(API_CORNERS, corners);

	addCallbacks(API_CORNERS_BROADCAST, cornersBroadcast);

	addCallbacks(API_INVITE_SEND, inviteSend);

	addCallbacks(API_INVITE_ANSWER, inviteAnswer);

	addCallbacks(API_ROOM_NEW, newRoom);

	addCallbacks(API_ROOM_REMOVE, removeRoom);

	addCallbacks(API_ECHO, echo);

	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Handle messages
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

	/**
	 * Change the name of a user based on the connection, i.e. only the owner of the socket can change it's name.
	 * @method setName
	 * @param con {Websocket} connection
	 * @param name {String} New name
	 */
	function setName(con, name) {
		var user = getUserBySocket(con);
		var room = getRoomById(user.roomId);

		var oldName = user.name;

		user.setName(name);
		// Changing the room to looby also

		var data = JSON.stringify({
			name : user.name,
		});

		sendMessage(con, API_NAME_SET, data);

		if (oldName == "") {
			var data = JSON.stringify({
				id : user.id,
				name : user.name,
				roomId : user.roomId
			});
			//sendMessageToAllButSelf(user.id, API_USER_ENTER, data);
			sendMessageToAll(API_USER_ENTER, data);
		} else {
			var data = JSON.stringify({
				id : user.id,
				name : user.name
			});
			//sendMessageToAllButSelf(user.id, API_NAME_CHANGE, data);
			sendMessageToAll(API_NAME_CHANGE, data);
		}
	}

	/**
	 * Request a list of all rooms and users.
	 * @method list
	 * @param con {websocket} connection
	 */
	function list(con) {
		var listRooms = [];
		var listUsers = [];

		for (var i = 0, j = lRooms.length; i < j; i++) {
			var r = lRooms[i];
			console.log(r)
			listRooms.push([r.id, r.name, r.desc, r.type]);
		};

		for (var i = 0, j = lUsers.length; i < j; i++) {
			var u = lUsers[i];
			if (u.roomId != -1 && u.name != "") {
				listUsers.push([u.id, u.name, u.roomId]);
			}
		};

		var data = JSON.stringify({
			rooms : listRooms,
			users : listUsers
		});

		sendMessage(con, API_LIST, data);
	}

	/**
	 * Move between two rooms, notifying the leaving room with a API_USER_LEAVE event and the entering room with a API_USER_ENTER
	 * @method userChange
	 * @param con {websocket} connection
	 * @param newRoomId {Int} The if of the room to move to
	 * @param passKey {String} (optional) Passkey for private rooms.
	 */
	function userChange(con, newRoomId, passKey) {
		var user = getUserBySocket(con);
		var room = getRoomById(user.roomId);

		var data = JSON.stringify({
			id : user.id
		});
		
		console.log("Password room");
		console.log(room);
		//console.log(room.pass);
		console.log(passKey);
			
		
		if (room.pass != "") {
			console.log("password is not empty");
			
			if (room.pass == passKey) {
				// Check if password is correct
					
			} else if (room.pass == "AHP") {
				// Check if passkey is correct
				
			} else {
				console.log("Wrong pass");
				// Wrong pass notify user and abort.
				sendMessage(con, API_ROOM_REFUSED, JSON.stringify({
					roomId: user.roomId
				}));
				
				return;
			}
			
		}

		if (user.name != "" && user.roomId != -1) {
			//sendMessageToRoom(user.id, user.roomId, API_USER_LEAVE, data);
			sendMessageToAll(API_USER_LEAVE, data);

			if (user.inCall) {
				// TODO: Should this call really be made? Does it have a purpose?
				sendMessageToRoom(user.id, user.roomId, API_INVITE_LEAVE, data);

				user.call.removeUser(user);
				// TODO: What should the remaning users do in the call?
				// 1. They should be able to continiue the call
				// 2. They should also end the call? (maybe if the first caller leaves the call)
			}
		}
		user.roomId = newRoomId;

		var data = JSON.stringify({
			id : user.id,
			name : user.name,
			roomId : user.roomId
		});

		//sendMessageToRoom(user.id, newRoomId, API_USER_ENTER, data);
		sendMessageToAll(API_USER_ENTER, data);
		
		sendMessage(con, API_ROOM_ENTER, JSON.stringify({
			roomId: user.roomId
		}));
	}

	/**
	 * Send a message to a recipient.
	 * @method message
	 * @param con {websocket} connection
	 * @param recipientId {Int} The id of the recipient
	 * @param message {String} Message to deliver to the recipient
	 */
	function message(con, recipientId, message) {
		var recipient = getUserById(recipientId);
		var data = JSON.stringify({
			msg : message
		});
		sendMessage(API_MESSAGE, recipient.socket, data);
	}

	/**
	 * Send a message to all users in the current room.
	 * @method messageBroadcast
	 * @param con {websocket} connection
	 * @param message {String} Message to deliver to the recipients
	 */
	// (do we want to differentiate between broadcast or not?)
	function messageBroadcast(con, message) {
		var recipients = getUserBySocket(con);

		var data = JSON.stringify({
			sender : recipients.id,
			msg : message
		});
		sendMessageToRoom(recipients.id, recipients.roomId, API_MESSAGE, data);
	}

	/**
	 * Send a API_CORNERS to an recipient, notifying it of the new corners for use by the projector.
	 * @method corners
	 * @param con {websocket} connection
	 * @param recipientId {Int} The id of the recipient
	 * @param nw North West corner of projector screen
	 * @param ne North East corner of projector screen
	 * @param se South East corner of projector screen
	 * @param sw South West corner of projector screen
	 * @param label {String} Label of video stream to identify which stream to use
	 */
	function corners(con, recipientId, nw, ne, se, sw, label) {
		var recipient = getUserById(recipientId);

		var data = JSON.stringify({
			nw : nw,
			ne : ne,
			se : se,
			sw : sw,
			videoLabel : label
		});

		sendMessage(recipient.socket, API_CORNERS, data);
	}

	/**
	 * Send a API_CORNERS_BROADCAST to all users in the current room, notifying the users of the new corners for use by the projector.
	 * @method cornersBroadcast
	 * @param con {websocket} connection
	 * @param nw North West corner of projector screen
	 * @param ne North East corner of projector screen
	 * @param se South East corner of projector screen
	 * @param sw South West corner of projector screen
	 * @param label {String} Label of video stream to identify which stream to use
	 */
	function cornersBroadcast(con, nw, ne, se, sw, label) {
		var recipients = getUserBySocket(con);

		var data = JSON.stringify({
			sender : recipients.id,
			nw : nw,
			ne : ne,
			se : se,
			sw : sw,
			videoLabel : label
		});
		sendMessageToRoom(recipients.id, recipients.roomId, API_CORNERS_BROADCAST, data);
	}

	/**
	 * Send a API_INVITE_SEND to the another user to initiate a call (inviting to a existing room).
	 * @method inviteSend
	 * @param con {websocket} connection
	 * @param recipientId {Int} id of the recipient of the call
	 * @param roomId {Int} id of the room inviting to
	 */
	function inviteSend(con, recipientId, roomId) {
		if (roomId < 1) {
			return null;
		}

		var caller = getUserBySocket(con);
		var recipient = getUserById(recipientId);
		var room = getRoomById(roomId);

		var call = createNewCall(caller, recipient, roomId);

		console.log(room);

		if (caller == null || recipient == null || room == null) {
			return;
		}

		var data = JSON.stringify({
			name : caller.name,
			roomName : room.name,
			callId : call.id
		});

		sendMessage(recipient.socket, API_INVITE_SEND, data);
	}

	/**
	 * Send a API_INVITE_ANSWER to the caller and send API_INVITE_ACCEPTED / API_INVITE_DECLINED to the invited user as loopback
	 * @method inviteAnswer
	 * @param con {websocket} connection
	 * @param callId {Int} id of the recipient of the call
	 * @param answer {String} id of the room inviting to
	 */
	function inviteAnswer(con, callId, answer) {
		var call = getCallById(callId);

		if (call == null) {
			console.log((new Date()) + " call is null, stop hacking! " + con.remoteAddress);
			return;
		}

		var data = JSON.stringify({
			id : getUserBySocket(con).id,
			answer : answer
		});

		console.log("Answer: " + answer);

		for (var i = 0, j = call.users.length; i < j; i++) {
			if (!call.users[i].inCall) {
				sendMessage(call.users[i].socket, API_INVITE_ANSWER, data);
			}
		};

		// Loopback for the called user to get event reactions
		if (answer == "yes") {
			call.setCall(true);

			var data = JSON.stringify({
				roomId : call.roomId,
				passKey: "abc" //Passkey for private room
			});

			sendMessage(con, API_INVITE_ACCEPTED, data);

		} else {// answer = no TODO: check this
			sendMessage(con, API_INVITE_DECLINED, JSON.stringify({
				callId : callId
			}));

			call.removeUser(getUserBySocket(con));
		}
	}

	/**
	 * Send a API_ROOM_NEW to all users signaling that a new room has been created.
	 * @method newRoom
	 * @param con {websocket} connection
	 * @param name {String} Name of the new room
	 * @param typeS {String} Type of the new room
	 * @param desc {String} (optional) Description of the new room, shown in the lobby
	 * @param pass {String} (optional) Password for the new room
	 */
	function newRoom(con, name, typeS, desc, pass) {

		if (desc == null) {
			desc = ""
		}

		if (pass == null) {
			pass = ""
		}

		var roomId = createNewRoom(name, typeS, desc, pass);

		console.log(lRooms)

		var data = JSON.stringify({
			id : roomId,
			name : name,
			desc : desc,
			type : typeS
		});

		//TODO: Callback to creator (if want to go into room directly)

		sendMessageToAll(API_ROOM_NEW, data);
	}

	/**
	 * Remove the room and send a API_ROOM_REMOVE message to all users.
	 * @method removeRoom
	 * @param con {websocket} connection
	 * @param id {Int} id of room to remove
	 */
	function removeRoom(con, id) {

		if (id == 0) {
			console.log((new Date()) + " trying to remove lobby...");
			return;
		}

		for (var i = 0, j = lUsers.length; i < j; i++) {
			if (lUsers[i].roomId == id) {
				console.log((new Date()) + " trying to remove non-empty room");
				return;
			}
		};

		removeRoomById(id);

		var data = JSON.stringify({
			id : id
		});

		sendMessageToAll(API_ROOM_REMOVE, data);
	}

	/**
	 * Echos the message back to the client to test that the websocket is working as inteaded.
	 * @method echo
	 * @param con {websocket} connection
	 * @param message {String} message to echo back
	 */
	function echo(con, message) {

		var data = JSON.stringify({
			msg : message
		});

		sendMessage(con, API_ECHO, data);
	}

	/*
	addCallbacks(, function(con, ){

	});
	TODO: CALLBACKS
	*/

	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Startup
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

	/**
	 * Create the lobby and some other rooms at startup of the server.
	 * @addon Load from disk/database an existing list of rooms.
	 * @method startup
	 */
	function startup() {
		// Create looby (gets ID 0)
		createNewRoom("Lobby", ROOM_PUBLIC, "", "");

		// Create some public test rooms
		// TODO: Should there be more rooms that are non-deletable?
		createNewRoom("Paris", ROOM_PUBLIC, "", "");
		createNewRoom("Berlin", ROOM_PUBLIC, "", "");
		createNewRoom("Rome", ROOM_PUBLIC, "", "");
		createNewRoom("Stockholm", ROOM_PUBLIC, "", "");
		createNewRoom("Delft", ROOM_PUBLIC, "", "");
		createNewRoom("Password room", ROOM_PUBLIC, "testing passwords", "pppp");
	}

	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Objects
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

	/**
	 * An object containing functionality for user handling
	 * @class obj_user
	 * @param socket {WebSocket} Socket to user for sending messages
	 */
	function obj_user(socket) {
		this.id = getNextUserId();
		this.name = "";
		this.roomId = -1;
		this.socket = socket;
		this.inCall = false;
		this.call = "";

		this.setName = function(name) {
			this.name = name;
			if (this.roomId == -1) {
				this.roomId = 0;
				// Always join lobby if the user is not in a room previously.
			}
		}
	}

	/**
	 * An object containing functionality for room handling
	 * @class obj_room
	 * @param name {String} Name of the room
	 * @param typeS {String} Type of the room
	 * @param desc {String} Description of room, may be empty
	 * @param pass {String} Password for room, may be empty
	 */
	function obj_room(name, typeS, desc, pass) {
		this.id = getNextRoomId();
		this.name = name;
		this.type = typeS;
		this.pass = pass;
		// maybe not yet?
		this.desc = desc;
		// not necissary
	}

	/**
	 * An object containing functionality for call/invite handling
	 * @class obj_room
	 * @param caller {obj_user} User that initiates the call
	 * @param called {obj_user} User that recives the invite
	 * @param roomId {Int} Description of room, may be empty
	 */
	function obj_call(caller, called, roomId) {
		this.id = getNextCallId();
		this.users = [];
		this.users.push(caller);
		this.users.push(called);
		this.roomId = roomId;

		caller.call = this;
		called.call = this;

		this.addUser = function(called) {
			this.users.push(called);
			called.call = this;
		}

		this.removeUser = function(called) {
			this.users.remove(called);
			called.call = null;
			called.inCall = false;
		}

		this.setCall = function(inCall) {
			for (var i = 0, j = this.users.length; i < j; i++) {
				this.users[i].inCall = inCall;
			};
		}
	}

	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// Room logic
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

	/**
	 * Create a new room and add it to the room list.
	 * @method
	 * @param name {String} Name of the new room
	 * @param typeS {String} Type of the new room
	 * @param desc {String} (optional) Description of the new room
	 * @param pass {String} (optional) Password for the new room
	 */
	function createNewRoom(name, typeS, desc, pass) {
		if (lRooms.length > LIMIT_ROOMS) {
			return;
		}
		var room = new obj_room(name, typeS, desc, pass);
		lRooms.push(room);
		return room.id;
	}

	/**
	 * Remove room by searching through the list to find the correct id.
	 * @method
	 * @param id {Int} Room to remove by it's id
	 */
	function removeRoomById(id) {
		if (id != 0) {
			var room = getRoomById(id);
			lRooms.remove(room);
		}
	}

	/**
	 * Get room by searching through the list to find the correct name.
	 * @method
	 * @param name {String} Room to get by it's name
	 */
	function getRoomByName(name) {
		for (var i = 0, j = lRooms.length; i < j; i++) {
			if (lRooms[i].name == name) {
				return lRooms[i];
			}
		};
	}

	/**
	 * Get room by searching through the list to find the correct id.
	 * @method
	 * @param id {Int} Room to get by it's id
	 */
	function getRoomById(id) {
		for (var i = 0, j = lRooms.length; i < j; i++) {
			if (lRooms[i].id == id) {
				return lRooms[i];
			}
		};
	}

	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// User logic
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

	/**
	 * Create a new user and add it to the user list.
	 * @method
	 * @param socket {WebSocket} The connectiong to the new user
	 */
	function addNewUser(socket) {
		if (lUsers.length > LIMIT_USERS) {
			return;
		}
		var user = new obj_user(socket);
		lUsers.push(user);
		return user;
	}

	/**
	 * Remove a user by it's id.
	 * @method
	 * @param id {Int} User to remove by it's id
	 */
	function removeUserById(id) {
		for (var i = 0, j = lUsers.length; i < j; i++) {
			if (lUsers[i].id == id) {
				removeUser(lUsers[i]);
			}
		};
	}

	/**
	 * Remove a user from the users list. (Used if additional operations becomes necicary at a later stage)
	 * @method
	 * @param user {obj_user} User to remove
	 */
	function removeUser(user) {
		lUsers.remove(user);
	}

	/**
	 * Get user by searching through the list to find the correct websocket connection.
	 * @method
	 * @param socket {WebSocket} Socket to search for
	 */
	function getUserBySocket(socket) {
		for (var i = 0, j = lUsers.length; i < j; i++) {
			if (lUsers[i].socket == socket) {
				return lUsers[i];
			}
		};
	}

	/**
	 * Get user by searching through the list to find the correct id.
	 * @method
	 * @param id {Int} Id to search for
	 */
	function getUserById(id) {
		for (var i = 0, j = lUsers.length; i < j; i++) {
			if (lUsers[i].id == id) {
				return lUsers[i];
			}
		};
	}

	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	// 						Call logic
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

	/**
	 * Create a new call signifing that a user has invited another user.
	 * @method
	 * @param caller {obj_user} User that is inviting
	 * @param called {obj_user} User that recives the invite
	 * @param roomId {Int} Room id that the inviter invites to
	 */
	function createNewCall(caller, called, roomId) {
		if (lCalls.length > LIMIT_CALLS) {
			return;
		}
		var call;
		if (caller.inCall) {
			call = caller.call.addUser(called);
		} else {
			call = new obj_call(caller, called, roomId);
			lCalls.push(call);
		}

		return call;
	}

	/**
	 * Get call by searching through the list for the correct id.
 	 * @param id {Int} Id to search for
	 */
	function getCallById(id) {
		for (var i = 0, j = lCalls.length; i < j; i++) {
			if (lCalls[i].id == id) {
				return lCalls[i];
			}
		};
	}

	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
	//
	// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


	/*
	 * Run startup script.
	 */
	startup();

}

//var S = new socketserver(); // Called outside in server.js instead.

module.exports.socketserver = socketserver; // Used to enable the object to be called from outside this file.