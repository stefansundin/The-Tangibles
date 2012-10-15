//#!/usr/bin/env node

var WebSocketServer = require('websocket').server;
var http = require('http')

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

var API_USER_NEW= "useradd";
var API_USER_REMOVE = "userremove";
var API_ROOM_NEW = "roomadd";
var API_ROOM_REMOVE = "roomremove";

var API_INVITE_SEND = "invitesend";
var API_INVITE_ANSWER = "inviteanswer";
var API_INVIE_TIMEOUT = "invitetimeout";

var API_MESSAGE = "message";

var API_CORNERS = "corners";

var API_SET_NAME = "setname";

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Propotype
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

Array.prototype.remove=function(key) {
	this.splice(this.indexOf(key), 1);	
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
	var chain = callbacks[event_name];
	if (typeof chain == 'undefined') 
		return; // no callbacks for this event
	
	for (var i = 0; i < chain.length; i++) {
		if (typeof(chain[i]) === 'function') {
			chain[i] (client, message);	
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
	var room = getRoomById(0);
	room.addUser(new _user(connection));
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
	var roomOld = getRoomByUserSocket(connection);
	var user = roomOld.getUserBySocket(connection);
	
	roomOld.removeUser(user);
	
	var name = user.name;
	
	for ( var i = 0; i < roomOld.users.length; i++) {
		if (roomOld.users[i] != null) {
			sendMessage(roomOld.users[i].socket, API_USER_LEAVE, name);	
		}
	}
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
		event:event_name, 
		data:event_data
	});
	connection.send(payload); // <= send JSON data
}

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Handle message
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #



/*
 * addCallbacks(, function(connection, message){ console.log((new Date()) + "
 * Firing: " + ); });
 */

/**
 * Updates the name based on the connection and room id.
 * 
 * @param connection
 *            WebSocket connection
 * @param message
 *            JSON encoded string containing the room id "id" and the new name
 *            "name"
 */
addCallbacks(API_SET_NAME, function(connection, name){
	console.log((new Date()) + " Firing: " + API_SET_NAME);
	//var json = JSON.parse(message.utf8Data);
	var room = getRoomByUserSocket(connection);
	var user = room.getUserBySocket(connection);
	
	if (user.name != "") {
		for ( var i = 0; i < room.users.length; i++) {
			sendMessage(room.users[i].socket, API_USER_LEAVE, user.name);
		}
	}
	
	//room.removeUser(user);
	
	user.name = name;
	
	for ( var i = 0; i < room.users.length; i++) {
		sendMessage(room.users[i].socket, API_USER_ENTER, user.name);
	}
	
	sendMessage(user.socket, API_SET_NAME, name);
});

/**
 * List all rooms
 * 
 * @param connection
 *            WebSocket connection
 * @param message
 *            Empty string ""
 */
addCallbacks(API_LIST_ROOMS, function(connection, message){
	console.log((new Date()) + " Firing: " + API_LIST_ROOMS);
	console.log(getRooms());
	sendMessage(connection, API_LIST_ROOMS, getRooms());
});


/**
 * List all rooms and list all users inside all rooms
 * 
 * @param connection
 *            WebSocket connection
 * @param message
 *            Empty string
 */
addCallbacks(API_LIST, function(connection, empty){
	console.log((new Date()) + " Firing: " + API_LIST);
	
	var listofAllUsers = [];
		
	for (var i=0; i < rooms.length; i++) {
		for (var j=0; j < rooms[i].users.length; j++) {
			if (rooms[i].users[j].name != "") {
				listofAllUsers.push( [ rooms[i].users[j].name, rooms[i].getName() ] );	
			}
  		};
	};
	
	var data = JSON.stringify({
			rooms:getRooms(),
			users:listofAllUsers
	});
		
	sendMessage(connection, API_LIST_USERS, data);
	

});







/**
 * List all users inside a room
 * 
 * @param connection
 *            WebSocket connection
 * @param message
 *            String containing the room name
 */
addCallbacks(API_LIST_USERS, function(connection, name){
	console.log((new Date()) + " Firing: " + API_LIST_USERS);
	
	if (name == "") { // All users in every room
		console.log((new Date()) + " List all rooms");
		var listofAllRooms = [];
		
		for (var i=0; i < rooms.length; i++) {
		  for (var j=0; j < rooms[i].users.length; j++) {
		  	if (rooms[i].users[j].name != "") {
		  		listofAllRooms.push( [ rooms[i].users[j].name, rooms[i].getName() ] );	
		  	}
		  };
		};
		
		var data = JSON.stringify({
			list:listofAllRooms
		});
		
		sendMessage(connection, API_LIST_USERS, data);
		
	} else {
		var room = getRoomByName(name);
		var usr = room.listUsersNamesOnly();
		
		var data = JSON.stringify({
			listusers:usr
		});
		
		sendMessage(connection, API_LIST_USERS, data);	
	}
	
	
});

/**
 * The client wants to travel to a new room. Notify all the users in the old
 * room of the clients absent. Notify all the users in the new room of the the
 * new client.
 * 
 * @param connection
 *            WebSocket connection
 * @param message
 *            JSON encoded string containing the old room name "oldRoom" and the
 *            new room name "newName"
 */
addCallbacks(API_ROOM_ENTER, function(connection, message){
	console.log((new Date()) + " Firing: " + API_ROOM_ENTER);
	//console.log(message);
	var json = JSON.parse(message);
	
	var roomOld = getRoomByName(json.oldRoom);
	var roomNew = getRoomByName(json.newRoom);
	
	var user = roomOld.getUserBySocket(connection);
	
	for ( var i = 0; i < roomOld.users.length; i++) {
		if (roomOld.users[i].socket != connection) {
			sendMessage(roomOld.users[i].socket, API_USER_LEAVE, user.name);
		}
	}
	
	for ( var i = 0; i < roomNew.users.length; i++) {
		sendMessage(roomNew.users[i].socket, API_USER_ENTER, user.name);
	}
	
	changeRooms(user, roomOld, roomNew);
	
});

// Should not be needed, is instead used when a connections is closed
addCallbacks(API_ROOM_LEAVE, function(connection, message){
	console.log((new Date()) + " Firing: " + API_ROOM_LEAVE);
	
});

/**
 * Client wants to start a call with another user.
 * 
 * @param connection
 *            WebSocket connection
 * @param message
 *            JSON encoded string containing the client name "user", the invited
 *            user "invite" and the room if accepting "room"
 */
addCallbacks(API_INVITE_SEND, function(connection, message){
	console.log((new Date()) + " Firing: " + API_INVITE_SEND);
	
	var json = JSON.parse(message);
	
	var invite = getUserByUserName(json.invite);
	
	var user = getUserByUserSocket(connection);
	
	var payload = JSON.stringify({
		user: user.name,
		room: json.room
	});
	
	sendMessage(invite.socket, API_INVITE_SEND, payload);
});

/**
 * An invite responds to a call.
 * 
 * @param connection
 *            WebSocket connection
 * @param message
 *            JSON encoded string containing the client name "user", the invited
 *            user "invite", the room if accepting "room" and the answer yes or
 *            no "answer"
 */
addCallbacks(API_INVITE_ANSWER, function(connection, message){
	console.log((new Date()) + " Firing: " + API_INVITE_ANSWER);
	
	var json = JSON.parse(message);
	
	var user = getUserByUserName(json.user);
	
	sendMessage(user.socket, API_INVITE_ANSWER, message);
});

// Instead the user could call Answer with NO
addCallbacks(API_INVIE_TIMEOUT, function(connection, message){
	console.log((new Date()) + " Firing: " + API_INVIE_TIMEOUT);
	
});


/**
 * Send a message to every user in the current room.
 * 
 * @param connection
 *            WebSocket connection
 * @param message
 *            Messeage defined by projector group
 */
addCallbacks(API_CORNERS, function(connection, message){
	console.log((new Date()) + " Firing: " + API_CORNERS);
	var room = getRoomByUserSocket(connection);
	
	if (room.getId() != 0) {
		for (var i=0; i < room.users.length; i++) {
			if (room.users[i].socket != connection) {
				sendMessage(room.users[i].socket, API_CORNERS, message);	
			}
		};
	}
});

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Startup
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

function startup(){
	// Create looby (gets ID 0)
	createNewRoom("Lobby");
	
	// Create some public test rooms
	createNewRoom("Paris");
	createNewRoom("Berlin");
	
}


// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Objects
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

var index = 0;
function getNextId(){
	return index++;
}

function _user(socket){
	this.name = "";
	this.socket = socket;
	this.state = ""
	
	this.setName = function(name){
		this.name = name;
	} 
}

function _room(name) {
	var id = getNextId();
	var name = name;
	this.users = [];
	
	this.addUser = function(user) {
		this.users.push(user);
	}
	
	this.removeUser = function(user) {
		this.users.remove(user);		
	}
	
	this.listUsers = function(){
		return this.users;
	}
	
	this.listUsersNamesOnly = function(){
		var listusers = []
		for (var i=0; i < this.users.length; i++) {
			if (this.users[i].name != "") {
				listusers.push(this.users[i].name);	
			}
		}
	return listusers;
	}
	
	this.getUserBySocket = function(socket){
		for (var i=0; i < this.users.length; i++) {
			if (this.users[i] != null) {
				if (this.users[i].socket == socket) {
					return this.users[i];
				}	
			}
		}
		return false;
	}
	
	this.getId = function(){
		return id;
	}
	
	this.getName = function(){
		return name;
	}
}


// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Room logic
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

var rooms = []

function createNewRoom(name){
	rooms.push(new _room(name));
}

function removeRoomByName(name){
	for (var i=0; i < rooms.length; i++) {
		if (rooms[i].name == name && rooms[i].id != 0) {
			rooms.remove(rooms[i]);
		}
	}
}

function getRoomByName(name){
	for (var i=0; i < rooms.length; i++) {
		if (rooms[i].getName() == name) {
			return rooms[i];
		}
	}
}

function getRoomById(id){
	for (var i=0; i < rooms.length; i++) {
		if (rooms[i].getId() == id) {
			return rooms[i];
		}
	}
}

function getRoomByUserSocket(socket){
	for (var i=0; i < rooms.length; i++) {
		for ( var j = 0; j < rooms[i].users.length; j++) {
			if (rooms[i].users[j].socket == socket) {
				return rooms[i];
			}
		}
	}
}

function getRooms(){
	var listrooms = [];
	for ( var i = 0; i < rooms.length; i++) {
		listrooms.push(rooms[i].getName());
	}
	return listrooms;
}

function changeRooms(user, oldRoom, newRoom){
	oldRoom.removeUser(user);
	newRoom.addUser(user);
}

function getUserByUserName(name){
	for ( var i = 0; i < rooms.length; i++) {
		for ( var j = 0; j < rooms[i].users.length; j++) {
			if (rooms[i].users[j].name == name) {
				return rooms[i].users[j];
			}
		}
	}
}

function getUserByUserSocket(socket){
	for ( var i = 0; i < rooms.length; i++) {
		for ( var j = 0; j < rooms[i].users.length; j++) {
			if (rooms[i].users[j].socket == socket) {
				return rooms[i].users[j];
			}
		}
	}
}

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// User logic
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// 						
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

startup();
