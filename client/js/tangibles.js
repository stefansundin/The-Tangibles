function Tangibles(webRTCSocket) {
	var self = this;
	this.api = null;
	this.sifteos = [];
	this.sphero = [];
	this.APIsocket = null;
	this.webRTCSocket = webRTCSocket;
	
	
	// Utility functions
	this.err = function(e) {
		console.log(e);
	}
	
	this.setColor = function(dev, color) {
		// color = "RRGGBB"
		console.log('setColor('+dev.id+','+color+')');
		self.api.showColor(dev.id, color, self.err, self.err);
	}

	this.setRightSpin = function(dev, velocity) {
		console.log('setRightSpin('+dev.id+','+velocity+')');
		self.api.spinRight(dev.id, velocity, self.err, self.err);
	}

	this.setLeftSpin = function(dev, velocity) {
		console.log('setLeftSpin('+dev.id+','+velocity+')');
		self.api.spinLeft(dev.id, velocity, self.err, self.err);
	}

	this.showTextPic = function(dev, url, text, color, bg) {
		this.showText(dev, text, color, bg);
		setTimeout(function() {self.showPicture(dev, url);}, 100);
	}

	this.showPicture = function(dev, url) {
		console.log('showPicture('+dev.id+','+url+')');
		this.api.showPicture(dev.id, url, this.err, this.err);
	}

	this.showText = function(dev, text, color, bg) {
		this.setColor(dev, bg);
		console.log('showText('+dev.id+','+text+','+color+')');
		setTimeout(function() {self.api.showText(dev.id, text, color, self.err, self.err);},100);
	}
	
	this.showTime = function(dev) {
		setInterval(function() {
			var d = new Date();
			var h = d.getHours();
			var m = d.getMinutes();
			var s = d.getSeconds();
			self.api.showText(dev.id, (h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s, '000000', self.err, self.err);
		}, 1000);
	}
	
	this.isSifteo = function(devId) {
		return devId.length == 24;
	}

	this.isSphero = function(devId) {
		return devId.length == 12;
	}
	
	// Run on pageunload or when current state is no longer valid to stop displaying and listening.
	this.disableSifteos = function() {
		for (d = 0; d < self.sifteos.length; d=d+1) {
			self.api.showColor(self.sifteos[d].id, 'FFFFFF', self.err, self.err, false);
			self.sifteos[d].pressListeners = [];
		}
	}
	this.disableSpheros = function() {
		for (d = 0; d < self.sphero.length; d=d+1) {
			self.api.showColor(self.sphero[d].id, 'FFFFFF', self.err, self.err, false);
			self.sphero[d].gyroListeners = [];
			self.sphero[d].accListeners = [];
		}
	}
	
	
	// Server API
	if(this.webRTCSocket){ 
		this.webRTCSocket.on(API_INVITE_SEND, function(name, room, call_id) {
			console.log(name +' '+ room +' '+ call_id);
			self.incommingCall(call_id, name, room, function() {
				lobby.accept(call_id);
			}, function() {
				lobby.decline(call_id);
			});
		});
		
		this.webRTCSocket.on(API_INVITE_ACCEPTED, function(room_id) {
			self.acceptedCall(room_id, []);
		});
		
		this.webRTCSocket.on(API_INVITE_DECLINED, function() {
			self.disableSifteos();
		});
		
		this.webRTCSocket.on(API_USER_ENTER, function(old_r, user, new_r) {
			if (user != lobby.ownName) return;
			if (!new_r) self.disableSifteos();
			if (new_r) self.acceptedCall(new_r, []);
		});
	}
	
	
	// Call control
	this.acceptedCall = function(call_id, users) {
		var enabled = true;
		
		for (i = 0; i < users.length; i = i + 1) {
			if (this.sifteos.length >= 3+i) this.showText(this.sifteos[3+i], users[i].name, '000000', 'FFFFFF');
		}
		
		if (this.sifteos.length >= 1) {
			this.showText(this.sifteos[0], 'Blank Workspace', '000000', 'FFFFFF');
			this.sifteos[0].pressListeners.push(function(msg) {
				if (enabled && onBlank) {
					onBlank(call_id);
				}
			});
		}
		
		if (this.sifteos.length >= 2) {
			this.showTextPic(this.sifteos[1], 'http://'+ window.location.host +'/img/deny.png', 'Deny', '000000', 'FFFFFF');
			this.sifteos[1].pressListeners.push(function(msg) {
				if (enabled) {
					enabled = false;
					self.showText(self.sifteos[1], 'Left room', '000000', 'FFFFFF');
					self.sifteos[1].pressListeners = [];
					lobby.leaveRoom();
				}
			});
		}
		
		if (this.sifteos.length >= 3) {
			this.showTextPic(this.sifteos[2], 'http://'+ window.location.host +'/img/mute.png', 'Mute', '000000', 'FFFFFF');
			this.sifteos[2].pressListeners.push(function(msg) {
				if (enabled && onMute) {
					onMute(call_id);
				}
			});
		}
	}
	
	this.incommingCall = function(call_id, caller, room, onAccept, onDeny) {
		var enabled = true;

		if (this.sphero.length >= 1) {
			var sphero = this.sphero[0];
			this.setColor(sphero, 'FFFF00'); // Yellow
			this.setLeftSpin(sphero, 150);

			// Accept
			sphero.gyroListeners.push(function(msg) {
				if (enabled) {
					var x = msg.params.x * 1;
					var y = msg.params.y * 1;
					console.log(msg.event+" x: "+x+" y: "+y);
					if ( Math.abs(x) + Math.abs(y) >= 50) { // When emulate a event pushing
						self.setColor(sphero,'00FF00');
						self.sphero[0].gyroListeners = [];
						enabled = false;
						onAccept(call_id);
					};
				}
			});
			// Deny
			// How?
		};

		if (this.sifteos.length >= 1) {
			this.showTextPic(this.sifteos[0], 'http://'+ window.location.host +'/img/accept.png', 'Accept', '000000', 'FFFFFF');
			this.sifteos[0].pressListeners.push(function(msg) {
				if (enabled) {
					enabled = false;
					self.sifteos[0].pressListeners = [];
					if (self.sifteos.length >= 2) self.sifteos[1].pressListeners = [];
					onAccept(call_id);
				}
			});
		}
		if (this.sifteos.length >= 2) {
			this.showTextPic(this.sifteos[1], 'http://'+ window.location.host +'/img/deny.png', 'Decline', '000000', 'FFFFFF');
			this.sifteos[1].pressListeners.push(function(msg) {
				if (enabled) {
					enabled = false;
					self.sifteos[0].pressListeners = [];
					self.sifteos[1].pressListeners = [];
					onDeny(call_id);
				}
			});
		}
		if (this.sifteos.length >= 3) this.showText(this.sifteos[2], caller+' invited you to '+room+'.', '000000', 'FFFFFF');
	}
	
	// Connect to the tangible api
	this.register = function(callback){
		$('#status').val('Connecting to TangibleAPI...');
		this.api = new TangibleAPI('127.0.0.1');
		this.api.register('Local tangible API', '', function(d) {
			self.registered = true;
			$('#status').val('Connected!');
			if(typeof callback != "undefined"){callback();}
			self.registerDevices();
		}, self.err);
	}
	
	// Reserve all devices from 
	this.registerDevices = function(){
		this.api.listDevices(function(d) {
			var num = d.msg.length;
			for (var i=0; i < num; i++) {
				var devid = d.msg[i].id;
				if (self.isSifteo(devid)) { 
					self.api.reserveDevice(devid, function(r) {
						console.log('Got sifteo device: '+r.msg);
						var device = {id:r.msg, subscribed:false, pressListeners:[]};
						self.listenToEvents(device);
						self.sifteos.push(device);
					}, self.err);
				} else if (self.isSphero(devid)) { 
					self.api.reserveDevice(devid, function(r) {
						console.log('Got sphero device: '+r.msg);
						var device = {id:r.msg, subscribed:false, gyroListeners:[], accListeners:[]};
						self.listenToEvents(device);
						self.sphero.push(device);
						self.setColor(device, 'FFFFFF');
					}, self.err);
				}
			}
			$('#status').val('Registered '+num+' devices!');
			$('#sifteo_stuff').removeAttr('disabled');
		}, this.err);
	}
	
	// Listen to all events from specified device
	this.listenToEvents = function(dev) {
		if (dev.subscribed) return;
		this.api.subscribeToEvents(dev.id, function(d) {
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
				self.eventHandler($.parseJSON(e.data).msg);
			};
		}, self.err);
	}
	
	// Handle single event and run appropriate event handlers
	this.eventHandler = function(msg) {
		if (msg.event == 'Accelerometer') {
			for (d = 0; d < this.sphero.length; d=d+1) {
				if (this.sphero[d].id == msg.devId) {
					for (i = 0; i < this.sphero[d].accListeners.length; i=i+1) {
						this.sphero[d].accListeners[i](msg);
					}
				}
			}
		} if (msg.event == 'GyroAttitude') {
			for (d = 0; d < this.sphero.length; d=d+1) {
				if (this.sphero[d].id == msg.devId) {
					for (i = 0; i < this.sphero[d].gyroListeners.length; i=i+1) {
						this.sphero[d].gyroListeners[i](msg);
					}
				}
			}
		} if (msg.event == 'pressed') {
			for (d = 0; d < this.sifteos.length; d=d+1) {
				if (this.sifteos[d].id == msg.devId) {
					for (i = 0; i < this.sifteos[d].pressListeners.length; i=i+1) {
						this.sifteos[d].pressListeners[i](msg);
					}
				}
			}
		}
	}
	
	$.getScript("js/tangibleLib.js", function(){
		self.register();
		
		/*
		// Debug
		testSpheroEvents = function(){
			if(self.sphero.length < 1){return;}
			
			self.sphero[0].gyroListeners.push(function(msg) {
				var x = msg.params.x * 1;
				var y = msg.params.y * 1;
				var z = msg.params.z * 1;
				game(x, y, "myCanvas");
				console.log(msg.event+" x: "+x+" y: "+y +" z: " +z);
			});

			self.sphero[0].accListeners.push(function(msg) {
				var x = msg.params.x * 50;
				var y = msg.params.y * 50;
				var z = msg.params.z * 50;
				x = Math.round(x*10)/10;
				y = Math.round(x*10)/10;
				z = Math.round(z*10)/10;
				game(x, z, "myCanvas");
				console.log(msg.event+" x: "+x+" y: "+y +" z: " +z);
			});
			
		};
		setTimeout(testSpheroEvents, 1000); // TODO make in a cleaner way
		*/
		
		// Release reserved devices
		$(window).on('beforeunload', function() { // TODO: Make global if needed
			self.disableSpheros();
			self.disableSifteos();
			self.webRTCSocket.send(API_USER_CHANGE, JSON.stringify({
				'id' : 0  // Goto Lobby
			}));
		});
	});
}

var tangibles = new Tangibles(socket);
