#!/usr/bin/env node

var WebSocketServer = require('websocket').server;
var http = require('http')

var server = http.createServer(function(request,response) {
	// process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});

server.listen(12345, function() {});

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
	
	var connection = request.accept('echo-protocol', request.origin);
	console.log((new Date()) + ' Connection accepted.');
	
	connection.on('event', function(message) {
		if (message.type === 'utf8') {
			console.log((new Date()) + message.utf8Data);
		} else {
			console.log((new Date()) + message.type);
			console.log((new Date()) + message);
		}
	});
	
	connection.on('message', function(message) {
		if (message.type === 'utf8') {
			var json = JSON.parse(message.utf8Data);
			console.log((new Date()) + ' event: ' + json.event + ', data: ' + json.data);
			
			var obj = JSON.stringify({
				event:"msg", 
				client:"aoao", 
				data:json.data + json.data
			});
			
			connection.send(obj);
			
		}
		
	});
	connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
