
var Socket = function(url) {
	
	this.API_USER_ENTER = "userenter";
	this.API_USER_LEAVE = "userleave";
	this.API_ROOM_ENTER = "roomenter";
	this.API_ROOM_LEAVE = "roomleave";
	
	this.API_LIST_ROOMS = "listrooms";
	this.API_LIST_USERS = "listusers";
	this.API_LIST = "listall";
	
	this.API_USER_CHANGE = "userchange" 
	this.API_USER_NEW = "useradd";
	this.API_USER_REMOVE = "userremove";
	this.API_ROOM_NEW = "roomadd";
	this.API_ROOM_REMOVE = "roomremove";
	
	this.API_INVITE_SEND = "invitesend";
	this.API_INVITE_ANSWER = "inviteanswer";
	this.API_INVITE_LEAVE = "inviteleave";
	this.API_INVITE_TIMEOUT = "invitetimeout";
	this.API_INVITE_ACCEPTED = "inviteroom";
	this.API_INVITE_DECLINED = "declineroom";
	
	this.API_MESSAGE = "msg";
	this.API_MESSAGE_BROADCAST = "msgbroadcast";
	
	this.API_CORNERS = "corners";
	this.API_CORNERS_BROADCAST = "cornersbroadcast";
	
	this.API_NAME_SET = "setname";
	this.API_NAME_CHANGE = "changename";
	
	this.API_ECHO = "echo";
	
	

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
