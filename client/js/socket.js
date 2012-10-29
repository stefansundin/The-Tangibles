
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


var Socket = function(url) {
	

	

	this.conn = new WebSocket(url, 'tangibles');

	this.opened = false;

	var callbacks = {};

	var self = this;

	this.on = function(event_name, callback) {
		callbacks[event_name] = callbacks[event_name] || [];
		callbacks[event_name].push(callback);
	};

	this.send = function(event_name, event_data) {
		var payload = JSON.stringify({
			event : event_name,
			data : event_data
		});
		self.conn.send(payload); // <= send JSON data to socket server
		return this;
	};

	// dispatch to the right handlers
	this.conn.onmessage = function(evt) {
		var json = JSON.parse(evt.data);
		fire(json.event, json.data);
	};

	this.reconnect = function() {
		// TODO Might be needed to test this function further...
		console.log("------ RECONNECT!");

		// Create a new socket and reconnect functions
		var oldconn = self.conn;
		self.conn = new WebSocket(url, 'tangibles');
		self.conn.onmessage = oldconn.onmessage;
		self.conn.onclose = oldconn.onclose;
		self.conn.onopen = oldconn.onopen;
	};

	this.conn.onclose = function() {
		fire('close', null);
		self.opened = false;
		setTimeout(function() {
			self.reconnect();
		}, 1000); // Try to reconnect after 1 second
	};
	this.conn.onopen = function() {
		fire('open', null);
		self.opened = true;
	};

	var fire = function(event_name, message) {
		console.log("###### Fire: " + event_name);
		var chain = callbacks[event_name];
		if (typeof chain == 'undefined')
			return; // no callbacks for this event

		for ( var i = 0; i < chain.length; i++) {
			if (typeof (chain[i]) === 'function') {
				var obj = JSON.parse(message);
				var args = [];
				for (j in obj) {
					args.push(obj[j]);
				}
				chain[i].apply(null, args);
			} else {
				console.log("not a function: ");
				console.log(typeof (chain[i]));
				console.log(chain[i]);
			}
		}
	};
};

var socket = new Socket("ws://" + window.location.hostname + ":12345");
