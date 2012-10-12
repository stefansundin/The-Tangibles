//#!/usr/bin/env node

var WebSocketServer = require('websocket').server;
var http = require('http')

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// 						Constants
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

var PORT_NUMBER = 12345;

var API_REMOTE_USER_LOGIN = "remoteuserlogin";
var API_REMOTE_USER_LOGOUT = "remoteuserlogout";
var API_ROOM_ENTER = "roomenter";
var API_ROOM_LEAVE = "roomleave";

var API_LIST_ROOMS = "listrooms";
var API_LIST_USERS = "listusers";

var API_USER_NEW= "useradd";
var API_USER_REMOVE = "userremove";
var API_ROOM_NEW = "roomadd";
var API_ROOM_REMOVE = "roomremove";

var API_INVITE_SEND = "invitesend";
var API_INVITE_ANSWER = "inviteanswer";
var API_INVIE_TIMEOUT = "invitetimeout";

var API_MESSAGE = "message";

var API_SET_NAME = "setname";

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// 						Propotype
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

Array.prototype.remove=function(key) {
	this.splice(this.indexOf(id), 1);	
}

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// 						Message callback
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


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

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// 						Server
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


var server = http.createServer(function(request,response) {
	// process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});

server.listen(PORT_NUMBER, function() {});

wsServer = new WebSocketServer({
	httpServer: server,
	// You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
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
	console.log((new Date()) + ' Connection accepted.');

	connection.on('message', function(message) {
		if (message.type === 'utf8') {
			var json = JSON.parse(message.utf8Data);
			fire(json.event, connection, json.data);	
		}
	});
	
	connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
    
    handleNewConnection(connection);
});

function handleNewConnection(connection){
	addNewUser(connection);
}

function sendMessage(connection, event_name, event_data) {
	var payload = JSON.stringify({
		event:event_name, 
		data:event_data
	});
	connection.send(payload); // <= send JSON data
}

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// 						Handle message
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #



/*
addCallbacks(, function(connection, message){
	console.log((new Date()) + " Firing: " + );
});
*/

/**
 * Updates the name based on the connection and room id.
 * 
 * @param connection
 * 			Websocket connection
 * @param message
 * 			JSON encoded string containing the room id "id" and the new name "name"
 */
addCallbacks(API_SET_NAME, function(connection, message){
	console.log((new Date()) + " Firing: " + API_SET_NAME);
	var json = JSON.parse(message.utf8Data);
	var user = getRoomById(json.id).getUserBySocket(connection);
	user.name = json.name;
});

addCallbacks(API_LIST_USERS, function(connection, id){
	console.log((new Date()) + " Firing: " + API_LIST_USERS);
	
	var room = getRoomById(id);
	var usr = room.listUsersNamesOnly();
	
	var data = JSON.stringify({
		listusers:usr
	});
	
	sendMessage(connection, API_LIST_USERS, data);
});

addCallbacks(API_REMOTE_USER_LOGIN, function(connection, message){
	console.log((new Date()) + " Firing: " + API_REMOTE_USER_LOGIN);
	
});

addCallbacks(API_REMOTE_USER_LOGOUT, function(connection, message){
	console.log((new Date()) + " Firing: " + API_REMOTE_USER_LOGOUT);
	
});

addCallbacks(API_INVITE_SEND, function(connection, message){
	console.log((new Date()) + " Firing: " + API_INVITE_SEND);
	
});

addCallbacks(API_INVITE_ANSWER, function(connection, message){
	console.log((new Date()) + " Firing: " + API_INVITE_ANSWER);
	
});

addCallbacks(API_INVIE_TIMEOUT, function(connection, message){
	console.log((new Date()) + " Firing: " + API_INVIE_TIMEOUT);
	
});

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// 						Startup
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

function startup(){
	// Create looby (gets ID 0)
	createNewRoom("Lobby");
}


// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// 						Objects
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

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
	var users = [];
	
	this.addUser = function(user) {
		users.push(user);
	}
	
	this.removeUser = function(user) {
		users.remove(user);		
	}
	
	this.listUsers = function(){
		return users;
	}
	
	this.listUsersNamesOnly = function(){
		var listusers = []
		for (var i=0; i < users.length; i++) {
			if (users[i].name != "") {
				listusers.push(users[i].name);	
			}
		}
	return listusers;
	}
	
	this.getUserBySocket = function(socket){
		for (var i=0; i < users.length; i++) {
			if (users[i].socket == socket) {
				return users[i];
			}
		}
	}
	
	this.getId = function(){
		return id;
	}
	
	this.getName = function(){
		return name;
	}
}


// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// 						Room logic
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

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

function getRoomById(id){
	for (var i=0; i < rooms.length; i++) {
		if (rooms[i].id == id) {
			return rooms[i];
		}
	}
}

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// 						User logic
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

var users = []

function addNewUser(name){
	users.push(new _user(name));
}

function removeUser(user){
	users.remove(user);
}

function removeUserByName(name){
	for (var i=0; i < users.length; i++) {
		if (users[i].name == name) {
			removeUser(users[i]);
		}
	}
}

function getUserByName(name){
	for (var i=0; i < users.length; i++) {
		if (users[i].name == name) {
			return users[i];
		}
	}
}

function getUserBySocket(socket){
	for (var i=0; i < users.length; i++) {
		if (users[i].socket == socket) {
			return users[i];
		}
	}
}

function getUsers(){
	var listusers = []
	for (var i=0; i < users.length; i++) {
		if (users[i].name != "") {
			listusers.push(users[i].name);	
		}
	}
	return listusers
}

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// 						
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

startup();
