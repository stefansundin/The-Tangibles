function Tangibles(WebWRTsocket) {
	this.api = null;
	this.devices = [];
	this.socket = null;
	this.registered = false;
	this.WebWRTsocket = WebWRTsocket;

	this.err = function(e) {
		console.log(e.msg);
	}

	this.onExit = function(e) {
		console.log("Release");
		this.api.releaseAllthis.devices(this.err, this.err);
		this.api.unregister(function(e){
			this.err(e);this.registered = false;
		}, this.err);
	}

	var self = this;
	
	// this.api lisen
	if(typeof this.WebWRTsocket != "undefined"){
		//this.WebWRTsocket.on(API_INVITE_SEND, onINVITE_SEND);
	}

	this.preRegisterDevices = function(){
		if(!this.registered){this.register(this.registerDevices);return;};
		this.registerDevices();
	}

	this.registerDevices = function(){
		this.api.listDevices(function(d) {
			var num = d.msg.length;
			for (var i=0; i < num; i++) {
				var devid = d.msg[i].id;
				this.api.reserveDevice(devid, function(r) {
					console.log('Got device: '+r.msg);
					var device = {id:r.msg, subscribed:false, pressListeners:[]};
					this.listenToEvents(device);
					this.devices.push(device);
				}, this.err);
			}
			$('#status').val('Registered '+num+' this.devices!');
			$('#sifteo_stuff').removeAttr('disabled');
		}, this.err);
	}

	this.listenToEvents = function(dev) {
		if (dev.subscribed) return;
		this.api.subscribeToEvents(dev.id, function(d) {
			console.log('Listening on events from '+dev.id);
			dev.subscribed = true;
			if (socket != null) return;
			
			socket = new WebSocket('ws://127.0.0.1:' + d.msg.port + '/streaming');
			socket.onopen = function(e) {
				console.log('Opened websocket: '+e.target.URL);
				socket.send(JSON.stringify({'flow': 'ctrl', 'msg' : this.api.getAppUUID()}));
			};
			socket.onerror = function(e) {
				console.log('Error: ' + e.data);
			};
			socket.onclose = function(e) {
				console.log('Close: ' + e.data);
			};
			socket.onmessage = function(e) {
				var data = $.parseJSON(e.data);
				console.log('Received: '+e.data);
				this.eventHandler(data.msg);
			};
		}, this.err);
	}

	this.eventHandler = function(msg) {
		if (msg.event == 'pressed') {
			for (d = 0; d < this.devices.length; d=d+1) {
				if (this.devices[d].id == msg.devId) {
					for (i = 0; i < this.devices[d].pressListeners.length; i=i+1) {
						this.devices[d].pressListeners[i](msg);
					}
				}
			}
		}
	}

	this.setColor = function(dev, color) {
		// color = "RRGGBB"
		console.log('setColor('+dev.id+','+color+')');
		this.api.showColor(dev.id, color, this.err, this.err);
	}

	this.showTextPic = function(dev, url, text, color, bg) {
		this.showText(dev, text, color, bg);
		this.showPicture(dev, url);
	}

	this.showPicture = function(dev, url) {
		console.log('showPicture('+dev.id+','+url+')');
		this.api.showPicture(dev.id, url, this.err, this.err);
	}

	this.showText = function(dev, text, color, bg) {
		this.setColor(dev, bg);
		console.log('showText('+dev.id+','+text+','+color+')');
		setTimeout(function() {this.api.showText(dev.id, text, color, this.err, this.err, this.err);},100);
	}

	this.acceptedCall =	function(call_id, users, onHangup, onMute, onBlank) {
		var enabled = true;
		
		this.showText(this.devices[0], 'Blank Workspace', '000000', 'FFFFFF');
		this.showTextPic(this.devices[2], 'http://localhost/mute.png', 'Mute', '000000', 'FFFFFF');
		this.showTextPic(this.devices[1], 'http://localhost/deny.png', 'Deny', '000000', 'FFFFFF');
		
		for (i = 0; i < users.length; i = i + 1) {
			this.showText(this.devices[3+i], users[i].name, '000000', 'FFFFFF');
		}
		
		this.devices[1].pressListeners.push(function(msg) {
			if (enabled) {
				enabled = false;
				this.showText(this.devices[1], 'Call ended', '000000', 'FFFFFF');
				this.devices[1].pressListeners = [];
				onHangup(call_id);
			}
		});
		
		this.devices[2].pressListeners.push(function(msg) {
			if (enabled && onMute) {
				onMute(call_id);
			}
		});
		
		this.devices[0].pressListeners.push(function(msg) {
			if (enabled && onBlank) {
				onBlank(call_id);
			}
		});
	}

	this.incommingCall = function(call_id, caller, room, onAccept, onDeny) {
		this.showTextPic(this.devices[0], 'http://localhost/accept.png', 'Accept', '000000', 'FFFFFF');
		this.showTextPic(this.devices[1], 'http://localhost/deny.png', 'Decline', '000000', 'FFFFFF');
		this.showText(this.devices[2], caller+' invited you to '+room+'.', '000000', 'FFFFFF');
		
		var enabled = true;
		
		this.devices[0].pressListeners.push(function(msg) {
			if (enabled) {
				enabled = false;
				this.devices[0].pressListeners = [];
				this.devices[1].pressListeners = [];
				onAccept(call_id);
			}
		});
		this.devices[1].pressListeners.push(function(msg) {
			if (enabled) {
				enabled = false;
				this.devices[0].pressListeners = [];
				this.devices[1].pressListeners = [];
				onDeny(call_id);
			}
		});
	}

	this.register = function(callback){
		// Connect to
		$('#status').val('Connecting to TangibleAPI...');
		this.api = new TangibleAPI('127.0.0.1');
		this.api.register('My this.api', 'Desc', function(d) {
			registered = true;
			$('#status').val('Connected!');
			$('#button_register_this.devices').removeAttr('disabled');
			if(typeof callback != "undefined"){callback();}
			this.preRegisterDevices.devices();
		}, this.err);
	}

	$.getScript("/The-Tangibles/tangibles/tangibleLib.js", function(){
		console.log(self.devices);
		self.register();
		$(window).on('beforeunload', self.onExit); // If needed make global function
	});

	// API

	this.onINVITE_SEND = function (name, room, call_id){
		console.log(onINVITE_SEND);
		console.log(name, room, call_id);
		/* TODO Someone fix parentes
		api.incommingCall(call_id, caller, room, function() {
			socket.send(API_INVITE_ANSWER, JSON.stringify({
				'callId' : call_id,
				'answer' : 'yes'
			}));
		}, function() {
			socket.send(API_INVITE_ANSWER, JSON.stringify({
				'callId' : call_id,
				'answer' : 'no'
			}));
		}*/
	}
}


