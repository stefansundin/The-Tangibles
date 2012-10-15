
var API_LIST_USERS = "listusers";

var ClientSocket = function(url) {
	
	var conn = new WebSocket(url, 'tangibles');
	
	var callbacks = {};
	
	this.on = function(event_name, callback) {
		callbacks[event_name] = callbacks[event_name] || [];
		callbacks[event_name].push(callback);
	};
	
	this.send = function(event_name, event_data) {
		var payload = JSON.stringify({
			event:event_name, 
			data:event_data
		});
		conn.send(payload); // <= send JSON data to socket server
		return this;
	};
	
	// dispatch to the right handlers
	conn.onmessage = function(evt){
		var json = JSON.parse(evt.data);
		fire(json.event, json.data);
	};
	
	conn.onclose = function(){fire('close',null)};
	conn.onopen = function(){fire('open',null)};
	
	var fire = function(event_name, message) {
		console.log("###### Fire: " + event_name);
		var chain = callbacks[event_name];
		if (typeof chain == 'undefined') 
			return; // no callbacks for this event
		
		for (var i = 0; i < chain.length; i++) {
			if (typeof(chain[i]) === 'function') {
				chain[i] (message);	
			} else {
				console.log("not a function: ");
				console.log(typeof(chain[i]));
				console.log(chain[i]);
			}
		}
	}
};
