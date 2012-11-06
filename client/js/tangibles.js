function Tangibles(webRTCSocket) {
	var self = this;
	this.api = null;
	this.sifteos = [];
	this.sphero = [];
	this.APIsocket = null;
	this.webRTCSocket = webRTCSocket;
	
	// Utility functions
	this.err = function(xhr,status,error) {
		console.log('err');
		console.log(xhr);
		console.log(status);
		console.log(error);
	}
	this.err2 = function(error_message) {
		return function(xhr,status,error) {
			console.log('tangible error: '+error_message);
			$('#tangible_status').button({
				icons : { primary : 'ui-icon-tangiblestatus-error' },
			}).attr('title', error_message);
			self.registered = false;
		}
	}
	
	/**
	 * Show color on sifteo or sphero.
	 * 
	 * @param dev
	 *            The device object
	 * @param color
	 *            Color RRGGBB (hex)
	 */
	this.setColor = function(dev, color) {
		self.api.showColor(dev.id, color, undefined, self.err2('Unable to show color.'));
	}

	/**
	 * Spin sphero in right direction.
	 * 
	 * @param dev
	 *            The device object
	 * @param velocity
	 *            The velocity of the spin
	 */
	this.setRightSpin = function(dev, velocity) {
		if (!self.registered) return;
		self.api.spinRight(dev.id, velocity, undefined, self.err);
	}

	/**
	 * Spin sphero in left direction.
	 * 
	 * @param dev
	 *            The device object
	 * @param velocity
	 *            The velocity of the spin
	 */
	this.setLeftSpin = function(dev, velocity) {
		if (!self.registered) return;
		self.api.spinLeft(dev.id, velocity, undefined, self.err);
	}

	/**
	 * Set backgound and text, then show a image.
	 * Used since long loading time on images
	 * 
	 * @param dev
	 *            The device object
	 * @param url
	 *            The url to the image to show
	 * @param text
	 *            The temporary text to show
	 * @param color
	 *            The color of the temporary text
	 * @param bg
	 *            The background color of the temporary text
	 */
	this.showTextPic = function(dev, url, text, color, bg) {
		if (!self.registered) return;
		this.showText(dev, text, color, bg);
		setTimeout(function() {self.showPicture(dev, url);}, 100);
	}

	/**
	 * Show a picture on a sifteo
	 * 
	 * @param dev
	 *            The device object
	 * @param url
	 *            The url to the image to show
	 */
	this.showPicture = function(dev, url) {
		if (!self.registered) return;
		this.api.showPicture(dev.id, url, undefined, this.err2('Unable to show picture.'));
	}

	/**
	 * Set backgound and text.
	 * 
	 * @param dev
	 *            The device object
	 * @param text
	 *            The temporary text to show
	 * @param color
	 *            The color of the temporary text
	 * @param bg
	 *            The background color of the temporary text
	 */
	this.showText = function(dev, text, color, bg) {
		if (!self.registered) return;
		this.setColor(dev, bg);
		setTimeout(function() {self.api.showText(dev.id, text, color, undefined, self.err2('Unable to show text.')); }, 100);
	}
	
	/**
	 * Show the current time on a sifteo.
	 * 
	 * @param dev
	 *            The device object
	 */
	this.showTime = function(dev) {
		if (!self.registered) return;
		setInterval(function() {
			var d = new Date();
			var h = d.getHours();
			var m = d.getMinutes();
			var s = d.getSeconds();
			self.api.showText(dev.id, (h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s, '000000', undefined, self.err);
		}, 1000);
	}
	
	/**
	 * Check if a device is a sifteo from device id.
	 * 
	 * @param devId
	 *            The device ID
	 */
	this.isSifteo = function(devId) {
		return devId.length == 24;
	}

	/**
	 * Check if a device is a sphero from device id.
	 * 
	 * @param devId
	 *            The device ID
	 */
	this.isSphero = function(devId) {
		// Check if device is a sphero
		return devId.length == 12;
	}
	
	
	/**
	 * Clear all about the sifteos
	 * 
	 */
	this.disableSifteos = function() {
		if (!self.registered) return;
		for (d = 0; d < self.sifteos.length; d=d+1) {
			self.sifteos[d].pressListeners = [];
			self.api.showColor(self.sifteos[d].id, 'FFFFFF', undefined, self.err2('Unable to disable sifteo: '+self.sifteos[d].id), false);
		}
	}

	/**
	 * Clear all about the spheros
	 * 
	 */
	this.disableSpheros = function() {
		if (!self.registered) return;
		for (d = 0; d < self.sphero.length; d=d+1) {
			self.sphero[d].gyroListeners = [];
			self.sphero[d].accListeners = [];
			self.api.showColor(self.sphero[d].id, 'FFFFFF', undefined, self.err2('Unable to disable sphero: '+self.sphero[d].id), false);
		}
	}
	
	/**
	 * Server API - Register listeners.
	 * 
	 */
	this.openServerAPI = function() {
		if(this.webRTCSocket){
			this.webRTCSocket.on(API_INVITE_SEND, function(name, room, call_id) {
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
			
			this.webRTCSocket.on(API_USER_ENTER, function(userId, userName, roomId) {
				if (userId != lobby.ownId) return;
				if (!roomId) self.disableSifteos();
				if (roomId) self.acceptedCall(roomId);
			});
		}
	}
	
	// Call control
	/**
	 * Run when the user is in a call. Will provide call controls and similar.
	 * 
	 * @param call_id
	 *            The ID of the call
	 */
	this.acceptedCall = function(call_id) {
		if (!self.registered) return;
		var enabled = true;
		
		if (this.sifteos.length >= 1) {
			this.showText(this.sifteos[0], 'Blank Workspace', '000000', 'FFFFFF');
			this.sifteos[0].pressListeners.push(function(msg) {
				if (enabled && onBlank) {
					onBlank(call_id);
				}
			});
		}
		
		if (this.sifteos.length >= 2) {
			this.showTextPic(this.sifteos[1], 'http://'+ window.location.host +'/img/deny.png', 'Hangup', '000000', 'FFFFFF');
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
	
	/**
	 * Run on a incoming call for user to be able to answer / decline call
	 * 
	 * @param call_id
	 *            The ID of the call
	 * @param caller
	 *            The name of the caller.
	 * @param room
	 *            Name of the room invited to
	 * @param onAccept
	 *            Callback on accepted call
	 * @param onDeny
	 *            Callback on denied call
	 */
	this.incommingCall = function(call_id, caller, room, onAccept, onDeny) {
		if (!self.registered) return;
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
			// TODO: Deny the call with sphero.
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
	
	/**
	 * Register to the tangible API and get devices.
	 * 
	 */
	this.register = function() {
		this.api = new TangibleAPI('127.0.0.1');
		this.api.register('Local tangible API', '', function(d) {
			self.registered = true;
			self.registerDevices();
			self.openServerAPI();
		}, self.err2('Could not connect to TangibleAPI'));
	}
	
	/**
	 * Reserve all devices from the tangible api and make them available.
	 * 
	 */
	this.registerDevices = function(){
		if (!self.registered) return;
		this.api.listDevices(function(d) {
			var num = d.msg.length;
			for (var i=0; i < num; i++) {
				var devid = d.msg[i].id;
				if (self.isSifteo(devid)) { 
					self.api.reserveDevice(devid, function(r) {
						var device = {id:r.msg, subscribed:false, pressListeners:[]};
						self.listenToEvents(device);
						self.sifteos.push(device);
					}, self.err);
				} else if (self.isSphero(devid)) { 
					self.api.reserveDevice(devid, function(r) {
						var device = {id:r.msg, subscribed:false, gyroListeners:[], accListeners:[]};
						self.listenToEvents(device);
						self.sphero.push(device);
						self.setColor(device, 'FFFFFF');
					}, self.err);
				}
			}
			self.sifteos.sort(function(a,b) { return parseInt(a.id,16) < parseInt(b.id,16) });
		}, this.err);
	}
	
	/**
	 * Listen to all events from specified device
	 * 
	 * @param dev
	 *            The device object
	 */
	this.listenToEvents = function(dev) {
		if (dev.subscribed) return;
		this.api.subscribeToEvents(dev.id, function(d) {
			dev.subscribed = true;
			if (self.APIsocket != null) return;
			
			self.APIsocket = new WebSocket('ws://127.0.0.1:' + d.msg.port + '/streaming');
			self.APIsocket.onopen = function(e) {
				self.APIsocket.send(JSON.stringify({'flow': 'ctrl', 'msg' : self.api.getAppUUID()}));
			};
			self.APIsocket.onerror = function(e) {
			};
			self.APIsocket.onclose = function(e) {
			};
			self.APIsocket.onmessage = function(e) {
				self.eventHandler($.parseJSON(e.data).msg);
			};
		}, self.err);
	}
	
	/**
	 * Handle single event and run appropriate event handlers
	 * 
	 * @param msg
	 *            The event message
	 */
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
	
	// Release reserved devices
	$(window).on('beforeunload', function() { // NOTE: Make global if needed
		self.disableSpheros();
		self.disableSifteos();
		self.webRTCSocket.send(API_USER_CHANGE, JSON.stringify({
			'id' : 0 // Goto Lobby
		}));
	});

	$(document).ready(function() {
		self.register();
		self.openServerAPI();
	});
}

var tangibles = new Tangibles(socket);
