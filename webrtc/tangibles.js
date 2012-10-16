

var initTangibles = function(){
	alert("initTangibles");
	$.getScript("tangiblesLib.js", function(){
		register();
	});
}

// API lisen
socket.on(API_INVITE_SEND, onINVITE_SEND);


var api;
var devices = [];
var socket = null;
var	registered = false;

function err(e) {
	console.log(e.msg);
}

function preRegisterDevices(){
	if(!registered){ register(registerDevices);return;};
	registerDevices();
}

function err(e) {
	console.log(e.msg);
}

function registerDevices() {
	api.listDevices(function(d) {
		var num = d.msg.length;
		for (var i=0; i < num; i++) {
			var devid = d.msg[i].id;
			api.reserveDevice(devid, function(r) {
				console.log('Got device: '+r.msg);
				var device = {id:r.msg, subscribed:false, pressListeners:[]};
				listenToEvents(device);
				devices.push(device);
			}, err);
		}
		$('#status').val('Registered '+num+' devices!');
		$('#sifteo_stuff').removeAttr('disabled');
	}, err);
}

function listenToEvents(dev) {
	if (dev.subscribed) return;
	api.subscribeToEvents(dev.id, function(d) {
		console.log('Listening on events from '+dev.id);
		dev.subscribed = true;
		if (socket != null) return;
		
		socket = new WebSocket('ws://127.0.0.1:' + d.msg.port + '/streaming');
		socket.onopen = function(e) {
			console.log('Opened websocket: '+e.target.URL);
			socket.send(JSON.stringify({'flow': 'ctrl', 'msg' : api.getAppUUID()}));
		};
		socket.onerror = function(e) {
			console.log('Error: ' + e.data);
		}
		socket.onclose = function(e) {
			console.log('Close: ' + e.data);
		}
		socket.onmessage = function(e) {
			var data = $.parseJSON(e.data);
			console.log('Received: '+e.data);
			eventHandler(data.msg);
		}
	}, err);
}

function eventHandler(msg) {
	if (msg.event == 'pressed') {
		for (d = 0; d < devices.length; d=d+1) {
			if (devices[d].id == msg.devId) {
				for (i = 0; i < devices[d].pressListeners.length; i=i+1) {
					devices[d].pressListeners[i](msg);
				}
			}
		}
	}
}

function setColor(dev, color) {
	// color = "RRGGBB"
	console.log('setColor('+dev.id+','+color+')');
	api.showColor(dev.id, color, err, err);
}

function showTextPic(dev, url, text, color, bg) {
	showText(dev, text, color, bg);
	showPicture(dev, url);
}

function showPicture(dev, url) {
	console.log('showPicture('+dev.id+','+url+')');
	api.showPicture(dev.id, url, err, err);
}

function showText(dev, text, color, bg) {
	setColor(dev, bg);
	console.log('showText('+dev.id+','+text+','+color+')');
	setTimeout(function() {api.showText(dev.id, text, color, err, err, err);},100);
}

function acceptedCall(call_id, users, onHangup, onMute, onBlank) {
	var enabled = true;
	
	showText(devices[0], 'Blank Workspace', '000000', 'FFFFFF');
	showTextPic(devices[2], 'http://localhost/mute.png', 'Mute', '000000', 'FFFFFF');
	showTextPic(devices[1], 'http://localhost/deny.png', 'Deny', '000000', 'FFFFFF');
	
	for (i = 0; i < users.length; i = i + 1) {
		showText(devices[3+i], users[i].name, '000000', 'FFFFFF');
	}
	
	devices[1].pressListeners.push(function(msg) {
		if (enabled) {
			enabled = false;
			showText(devices[1], 'Call ended', '000000', 'FFFFFF');
			devices[1].pressListeners = [];
			onHangup(call_id);
		}
	});
	
	devices[2].pressListeners.push(function(msg) {
		if (enabled && onMute) {
			onMute(call_id);
		}
	});
	
	devices[0].pressListeners.push(function(msg) {
		if (enabled && onBlank) {
			onBlank(call_id);
		}
	});
}

function incommingCall(call_id, caller, room, onAccept, onDeny) {
	showTextPic(devices[0], 'http://localhost/accept.png', 'Accept', '000000', 'FFFFFF');
	showTextPic(devices[1], 'http://localhost/deny.png', 'Decline', '000000', 'FFFFFF');
	showText(devices[2], caller+' invited you to '+room+'.', '000000', 'FFFFFF');
	
	var enabled = true;
	
	devices[0].pressListeners.push(function(msg) {
		if (enabled) {
			enabled = false;
			devices[0].pressListeners = [];
			devices[1].pressListeners = [];
			onAccept(call_id);
		}
	});
	devices[1].pressListeners.push(function(msg) {
		if (enabled) {
			enabled = false;
			devices[0].pressListeners = [];
			devices[1].pressListeners = [];
			onDeny(call_id);
		}
	});
}

function register(callback){
	// Connect to
	$('#status').val('Connecting to TangibleAPI...');
	api = new TangibleAPI('127.0.0.1');
	api.register('My API', 'Desc', function(d) {
		registered = true;
		$('#status').val('Connected!');
		$('#button_register_devices').removeAttr('disabled');
		if(typeof callback != "undefined"){callback();}
		preRegisterDevices();
	}, err);
}


// API

function onINVITE_SEND(name, room, call_id) {
	console.log(caller);
	api.incommingCall(call_id, caller, room, function() {
		
	}, function() {
		
	});
}


