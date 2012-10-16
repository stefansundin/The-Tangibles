function Tangibles(WebRTCsocket) {
	var self = this;
	this.api = null;
	this.devices = [];
	this.APIsocket = null;
	this.registered = false;
	this.WebRTCsocket = WebRTCsocket;

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
	
	// this.api lisen
	if(this.WebRTCsocket){
		this.err('GOT SOCKET');
		//this.WebRTCsocket.on(API_INVITE_SEND, onINVITE_SEND);
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
				self.api.reserveDevice(devid, function(r) {
					console.log('Got device: '+r.msg);
					var device = {id:r.msg, subscribed:false, pressListeners:[]};
					self.listenToEvents(device);
					self.devices.push(device);
				}, self.err);
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
			if (self.APIsocket != null) return;
			
			self.APIsocket = new WebSocket('ws://127.0.0.1:' + d.msg.port + '/streaming');
			self.APIsocket.onopen = function(e) {
				console.log('Opened websocket: '+e.target.URL);
				self.APIsocket.send(JSON.stringify({'flow': 'ctrl', 'msg' : self.api.getAppUUID()}));
			};
			self.APIsocket.onerror = function(e) {
				console.log('Error: ' + e.data);
			};
			self.APIsocket.onclose = function(e) {
				console.log('Close: ' + e.data);
			};
			self.APIsocket.onmessage = function(e) {
				var data = $.parseJSON(e.data);
				console.log('Received: '+e.data);
				self.eventHandler(data.msg);
			};
		}, self.err);
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
		setTimeout(function() {self.api.showText(dev.id, text, color, self.err, self.err, self.err);},100);
	}

	this.acceptedCall =	function(call_id, users, onHangup, onMute, onBlank) {
		var enabled = true;
		
		this.showText(this.devices[0], 'Blank Workspace', '000000', 'FFFFFF');
		this.showTextPic(this.devices[2], 'http://localhost/client/img/mute.png', 'Mute', '000000', 'FFFFFF');
		this.showTextPic(this.devices[1], 'http://localhost/client/img/deny.png', 'Deny', '000000', 'FFFFFF');
		
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
		this.showTextPic(this.devices[0], 'http://localhost/client/img/accept.png', 'Accept', '000000', 'FFFFFF');
		this.showTextPic(this.devices[1], 'http://localhost/client/img/deny.png', 'Decline', '000000', 'FFFFFF');
		this.showText(this.devices[2], caller+' invited you to '+room+'.', '000000', 'FFFFFF');
		
		var enabled = true;
		
		this.devices[0].pressListeners.push(function(msg) {
			if (enabled) {
				enabled = false;
				self.devices[0].pressListeners = [];
				self.devices[1].pressListeners = [];
				onAccept(call_id);
			}
		});
		this.devices[1].pressListeners.push(function(msg) {
			if (enabled) {
				enabled = false;
				self.devices[0].pressListeners = [];
				self.devices[1].pressListeners = [];
				onDeny(call_id);
			}
		});
	}

	this.register = function(callback){
		// Connect to
		$('#status').val('Connecting to TangibleAPI...');
		this.api = new TangibleAPI('127.0.0.1');
		this.api.register('My this.api', 'Desc', function(d) {
			self.registered = true;
			$('#status').val('Connected!');
			$('#button_register_this.devices').removeAttr('disabled');
			if(typeof callback != "undefined"){callback();}
			self.registerDevices();
		}, self.err);
	}

	$.getScript("/client/js/tangibleLib.js", function(){
		self.register();
		$(window).on('beforeunload', self.onExit); // If needed make global function
	});

	// API

	this.onINVITE_SEND = function (name, room, call_id){
		console.log(onINVITE_SEND);
		console.log(name, room, call_id);
		api.incommingCall(call_id, caller, room, function() {
			WebRTCsocket.send(API_INVITE_ANSWER, JSON.stringify({
				'callId' : call_id,
				'answer' : 'yes'
			}));
		}, function() {
			WebRTCsocket.send(API_INVITE_ANSWER, JSON.stringify({
				'callId' : call_id,
				'answer' : 'no'
			}));
		});
	}
}



