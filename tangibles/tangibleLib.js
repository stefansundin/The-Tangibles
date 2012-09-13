/*  by /Leoj -- /Lekko -- /Lojeuv
 *
 */
/*jslint devel: true*/
/*global $, window, WebSocket */
//var api_ip_address = '130.240.94.8';
//var api_ip_address = 'localhost';
// <editor-fold defaultstate="collapsed" desc="Basic methods">
function tangibleREST(method, svr_ip, uri, params, onSuccess, onError, async) {
	"use strict";
	var ajaxParams = {
		type : method,
		dataType : "json",
		data : params
	};
	if (onSuccess !== undefined && onSuccess !== null) {
		ajaxParams.success =
			function (data, textStatus, jqXHR) {
				onSuccess(data);
			};
	}
	if (onError !== undefined && onError !== null) {
		ajaxParams.error =
			function (jqXHR, textStatus, errorThrown) {
				onError(errorThrown);
			};
	}
	if (async !== undefined && async !== null) {
		ajaxParams.async = async;
	}
	//console.log("making an ajax call to : " + uri);
	$.ajax(
		"http://" + svr_ip + ":9998/tangibleapi/" + uri,
		ajaxParams
	);
}

function tangibleGET(svr_ip, uri, params, onSuccess, onError, async) {
	"use strict";
	tangibleREST("GET", svr_ip, uri, params, onSuccess, onError, async);
}
function tangiblePOST(svr_ip, uri, params, onSuccess, onError, async) {
	"use strict";
	tangibleREST("POST", svr_ip,  uri, params, onSuccess, onError, async);
}
function tangibleDELETE(svr_ip, uri, params, onSuccess, onError, async) {
	"use strict";
	tangibleREST("DELETE", svr_ip,  uri, params, onSuccess, onError, async);
}
function tangiblePUT(svr_ip, uri, params, onSuccess, onError, async) {
	"use strict";
	tangibleREST("PUT", svr_ip,  uri, params, onSuccess, onError, async);
}
// </editor-fold>

function TangibleAPI(server_ip) {
	"use strict";
	var appUUID = null,
		reservedDevices = [],
		that = this,
		svr_ip = server_ip,
		reservationAttemptInProgress = [];

	function requestDeviceFromList(listOfDevices, onSuccess, onError, async) {
		var dev = listOfDevices.shift();
		that.reserveDevice(dev.id, onSuccess, function (data) {
			if (listOfDevices.length > 0) {
				requestDeviceFromList(listOfDevices, onSuccess, onError, async);
			} else {
				onError({
					msg : 'no device available for reservation: ' + data.msg
				});
			}
		}, async);
	}

	this.register = function (name, description, onSuccess, onError, async) {
		if (appUUID === null) {
			tangiblePUT(svr_ip, "app/registration/",
				{
					appname : name,
					description : description
				},
				function (data) {
					appUUID = data.msg;
					onSuccess(data);
				},
				onError, async);
		} else {
			onError({
				msg : 'application already registered'
			});
		}
	};
	this.unregister = function (onSuccess, onError, async) {
		if (appUUID === null) {
			onError({
				msg : 'application not registered, impossible to unregister'
			});
		} else {
			tangibleDELETE(svr_ip, "app/registration/" + appUUID, {},
				function (data) {
					appUUID = null;
					onSuccess(data);
				}, onError, async);
		}
	};
	this.listDevices = function (onSuccess, onError, async) {
		if (appUUID === null) {
			onError({
				msg : 'application not registered!'
			});
		} else {
			tangibleGET(svr_ip, appUUID + "/device/", {}, onSuccess, onError, async);
		}
	};
	this.reserveDevice = function (deviceId, onSuccess, onError, async) {
		if (appUUID === null) {
			onError({
				msg : 'application not registered!'
			});
		} else {
			if (reservationAttemptInProgress[deviceId] !== undefined) {
				//someone is already trying to get this device
				//so let's send an error message: if the other reservation failed there will be a reason
				onError({ msg: "an attempt to get this device is already running, try to get another one..."});
			} else {
				reservationAttemptInProgress[deviceId] = true;
//				console.log("about to make a call to reserve the device : " + deviceId);
				tangiblePUT(svr_ip, appUUID + "/device/reservation/" + deviceId, {},
					function (data) {
//						console.log("reservation successful");
						reservedDevices.push(data.msg);
						reservationAttemptInProgress[deviceId] = undefined;
						onSuccess(data);
					}, onError, async);
			}
		}
	};
	this.releaseDevice = function (deviceId, onSuccess, onError, async) {
		if (appUUID === null) {
			onError({
				msg : 'application not registered!'
			});
		} else {
			tangibleDELETE(svr_ip, appUUID + "/device/reservation/" + deviceId, {},
				function (data) {
					var idx = -1, i;
					for (i = 0; i < reservedDevices.length && idx === -1; i += 1) {
						if (reservedDevices[i] === data.msg) {
							idx = i;
						}
					}
					if (idx === -1) {
						onError({
							msg : 'internal problem occured during the releasing proccess'
						});
					} else {
						reservedDevices.splice(idx, 1);
						onSuccess(data);
					}
				}, onError, async);
		}
	};
	this.showColor = function (deviceId, color, onSuccess, onError, async) {
		if (appUUID === null) {
			onError({
				msg : 'application not registered!'
			});
		} else {
			tangiblePUT(svr_ip, appUUID + "/device_methods/" + deviceId + "/show_color",
				{
					color : color
				}, onSuccess, onError, async);
		}
	};
	this.showText = function (deviceId, text, color, onSuccess, onError, async) {
		if (appUUID === null) {
			onError({
				msg : 'application not registered!'
			});
		} else {
			tangiblePUT(svr_ip, appUUID + "/device_methods/" + deviceId + "/text_message",
				{
					msg : text,
					color : color
				}, onSuccess, onError, async);
		}
	};
	this.showPicture = function (deviceId, url, onSuccess, onError, async) {
		if (appUUID === null) {
			onError({
				msg : 'application not registered!'
			});
		} else {
			tangiblePUT(svr_ip, appUUID + "/device_methods/" + deviceId + "/show_picture",
				{
					url : url
				}, onSuccess, onError, async);
		}
	};
	this.fadeColor = function (deviceId, color, onSuccess, onError, async) {
		if (appUUID === null) {
			onError({
				msg: ' application not registered!'
			});
		} else {
			tangiblePUT(svr_ip, appUUID + "/device_methods/" + deviceId + "/fade_color",
				{
					color : color
				}, onSuccess, onError, async);
		}
	};
	this.requestAnyDevice = function (onSuccess, onError, async) {
		if (appUUID === null) {
			onError({
				msg : 'application not registered!'
			});
		} else {
			this.listDevices(
				function (data) {
					requestDeviceFromList(data.msg, onSuccess, onError, async);
				},
				onError,
				async
			);
		}
	};
	this.releaseAllDevices = function (onSuccess, onError, async) {
		if (reservedDevices.length === 0) {
			onSuccess({
				msg : 'all devices released successfully'
			});
		} else {
			this.releaseDevice(reservedDevices.shift(),
				function () {
					this.releaseAllDevices(onSuccess, onError, async);
				},
				function (data) {
					onError({
						msg : 'impossible to unrealease all the devices: ' + data.msg
					});
				}, async);
		}
	};
	this.subscribeToEvents = function (devId, onSuccess, onError, async) {
		if (appUUID === null) {
			onError({
				msg : 'application not registered'
			});
		} else {
			var uri = appUUID + "/device_methods/" + devId + "/subscribe";
			tangiblePUT(svr_ip, uri, {
				sock_type : 'ws'
			}, onSuccess, onError, async);
		}
	};
	this.getDeviceId = function (number) {
		return reservedDevices[number - 1].id;
	};
	this.getReservedDevices = function () {
		return reservedDevices;
	};
	this.getAppUUID = function () {
		return appUUID;
	};
}

function SubscriptionMgr() {
	'use strict';
	var wsStream, listenerDict = [];

	function filterEvents(rcvEvt) {
//		console.log('about to filter:' + rcvEvt.data);
		var jsonMsg = $.parseJSON(rcvEvt.data), devId, eventType, params, idx;
		if (jsonMsg.flow !== 'event') {
//			console.log("we recevied a non-event message, and ignored it");
			return;
		}
		if (jsonMsg.msg === undefined) {
//			console.log('no message in the received event, let\'s ignore it');
			return;
		}
		if (jsonMsg.msg.devId !== undefined &&
				jsonMsg.msg.event !== undefined) {
			devId = jsonMsg.msg.devId;
			eventType = jsonMsg.msg.event;
		} else {
//			console.log('missing a required field, let\'s ignore the message');
			return;
		}
		if (jsonMsg.msg.params !== undefined) {
			params = jsonMsg.msg.params;
		}
		if (listenerDict[devId] !== undefined) {
			//there might be someone waiting for an event on this device!
			if (listenerDict[devId][eventType] !== undefined) {
				//there is actually some people waiting for this message!
				for (idx = 0; idx < listenerDict[devId][eventType].length; idx += 1) {
					listenerDict[devId][eventType][idx](params);
				}
			}
		}
		//and that should be it... 
	}

	this.init = function (appUUID, uri) {
		wsStream = new WebSocket(uri);
		wsStream.onopen = function (evt) {
//			console.log('websocket is now open' + evt.data);
			wsStream.send(JSON.stringify({'flow': 'ctrl', 'msg' : appUUID}));
//			wsStream.send({'flow': 'ctrl', 'msg' : appUUID});
		};
		wsStream.onmessage = filterEvents;
//		console.log('SubscriptionMgr.init completed!');
	};

	this.addListener = function (onEvent, eventType, devId) {
//		console.log('SubscriptionMgr.addListener starting');
		if (listenerDict[devId] === undefined) {
			listenerDict[devId] = [];
			listenerDict[devId][eventType] = [];
		} else if (listenerDict[devId][eventType] === undefined) {
			listenerDict[devId][eventType] = [];
		}
		listenerDict[devId][eventType].push(onEvent);
		console.log('SubscriptionMgr.addListener completed: ' + eventType);
	};

	this.close = function () {
		wsStream.close();
		wsStream = undefined;
	};
	this.isInitialized = function () {
		return wsStream !== undefined;
	};
}


var tangibleComponent = function () {
	"use strict";
	var instance = (function () {
		//private part
		var api,
			labeledDevices = [],
			comingSoonDevices = [],
			onReadyListener = [],
			streamSubs = new SubscriptionMgr(),
			ready = false,
			svr_ip;

		function setReady(bool) {
			ready = bool;
			if (ready) {
				var listener;
				while ((listener = onReadyListener.shift()) !== undefined) {
					listener();
				}
			}
		}
		function initComponent(server_ip) {
			if (ready) {
				console.log('the tangibleComponent has already been initialized');
				return;
			}
			svr_ip = server_ip;
			api = new TangibleAPI(svr_ip);
			api.register("tangibleComponent",
				"gateway application to allow SATIN components to use the API",
				function () {
					$(window).bind('beforeunload', function () {
						api.unregister(
							function () {
								console.log("the tangibleComponent quit properly");
							},
							function (data) {
								console.log("couldn't quit properly : " + data.msg);
							},
							false
						);
					});
					setReady(true);
				},
				function () {
					console.log("impossible to register the tangibleComponent!");
				});
		}
		return {//public part
		  init : function (server_ip) {
				initComponent(server_ip);
			},
			useDevice : function (label, onUsable, onError, deviceProperties, async) {
//				console.log("the device " + label + " is required...");
				if (!ready) {
					onError({
						msg : "the tangibleComponent is not initialized!"
					});
					return;
				}
				var listener, dev, list = '';

				// <for debug code>
//				if (labeledDevices.length !== 0) {
//					for (dev in labeledDevices) {
//						if (labeledDevices.hasOwnProperty(dev)) {
//							list += dev + ' -> ' + labeledDevices[dev] + '   ';
//						}
//					}
//					console.log("labeledDevices has the following entries : " + list);
//				} else {
//					console.log("There are no device reserved yet");
//				}
				// </for debug code>

				//first, check is the device is already available
				if (labeledDevices[label] !== undefined) {
					//if it is well let's use it! right?
//					console.log("device already reserved with the id: " + labeledDevices[label]);
					onUsable(labeledDevices[label]);
				} else if (comingSoonDevices[label] !== undefined) {
					//2nd check: is the device already on its way?
					//the device is being required, let's just wait for it
//					console.log("be patient your device (" + label + ") is comming soon");
					comingSoonDevices[label].push(onUsable);
				} else {
					//otherwise, let's reserve it: we are the first one to require this device.
					if (deviceProperties === undefined) {
						//first as we are going to get the device let's warn the other
						comingSoonDevices[label] = [];
						//that should do it... : we created an array so that others can 
						// push themselves on it (see 2nd check)

						//now let's make the reservation :
						api.requestAnyDevice(function (data) {
							//the device is reserved now.
							labeledDevices[label] = data.msg;
//							console.log('new added element ' + labeledDevices[label]);
							onUsable(data.msg);// we can warn the user and let him do his stuff with it
							//we have the device, it's time to wake up the potential others
							if (comingSoonDevices[label] !== undefined) {
								while ((listener = comingSoonDevices[label].shift()) !== undefined) {
									listener(labeledDevices[label]);
								}
								//they should all know which device to use by now...
								//thus, we can reset the comingSoonDevice[label]
								comingSoonDevices[label] = undefined;
							}
						}, onError,
							async
						//false
							);
					} else {
						//TODO create a reservation based on the type of devices or on its capacity
						console.log("specifying deviceProperties is not implemented yet!");
						onError({msg : "the option deviceProperties is not implemented yet"});
					}
				}
			},
			onReadyCallback: function (callbackWhenReady) {
				onReadyListener.push(callbackWhenReady);
			},
			getAPI: function () {
				return api;
			},
			isReady: function () {
				return ready;
			},
			subscribeToEvent: function (devId, eventType, onEvent, onError) {
				api.subscribeToEvents(devId,
					function (data) {
//						console.log('subscription to event succesfully made');
						streamSubs.addListener(onEvent, eventType, devId);
						if (!streamSubs.isInitialized()) {
//							console.log('SubscriptionMgr not initialized yet');
							var uri = 'ws://' + svr_ip + ':' + data.msg.port + '/streaming';
//							console.log('trying to reach the following uri ' + uri);
							streamSubs.init(api.getAppUUID(), uri);
						}
					}, onError);
			}
		};
	}());

	tangibleComponent = function () {
		return instance;
	};
	return tangibleComponent();
};

function onErrorMaker(msg) {
	'use strict';
	if (msg === undefined) {
		msg = 'something went wrong: ';
	}
	return function (data) {
		console.log(msg + data.msg);
	};
}
