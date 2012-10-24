var lobby; // Global object for the lobby

$(function() {
	lobby = new Lobby();
	lobby.init();

	if (sessionStorage.ownName) {
		lobby.loadMain();
	} else {
		lobby.loadSplash();
	}
});

function assert(exp, message) {
	if (!exp) {
		console.error(message);
	}
}

function Lobby() {
	this.AUTO_DECLINE_TIME = 60;
	this.lobbyId = 0; // Special room id for the lobby
	this.room_type_public = 'public'; // TODO Fix types
	this.room_type_private = 'private';
	this.rooms = []; // [id, name, desc, type]
	this.users = []; // [id, name, room_id]
	if (sessionStorage.ownName) { // TODO Change all session to localStorage?
		this.ownName = sessionStorage.ownName;
	} else {
		this.ownName = 'User#' + Math.floor((Math.random() * 999) + 1);
	}
}

/**
 * Shows a dialog with the text.
 * 
 * @param text
 *            The text to display.
 */
Lobby.prototype.showError = function(text) {
	$('#dialog_error_text').text(text);
	$('#dialog_error').dialog('open');
};

/**
 * Initializes all the dialogs, DIVs etc.
 */
Lobby.prototype.init = function() {
	var self = this;

	$('#roomFrame').hide();

	$('#room_table tfoot').hide();

	$('#display_user_name').text(this.ownName);

	$('#create_room, #change_user_name').button();
	$('#create_room').click(function() {
		$('#dialog_create_room').dialog('open');
	});
	$('#change_user_name').click(function() {
		$('#dialog_select_user_name').dialog('open');
	});

	$('#dialog_error').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		buttons : {
			OK : function() {
				$(this).dialog('close');
			}
		}
	});

	$('#dialog_select_user_name').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		open : function(event, ui) {
			$('#user_name').val(self.ownName);
			$('#user_name').select();
			$('#user_name').removeClass('ui-state-error');
		},
		buttons : {
			OK : function() {
				var name = $('#user_name').val();
				if (name == '') {
					$('#user_name').addClass('ui-state-error');
				} else {
					self.changeOwnName(name);
					$(this).dialog('close');
				}
			},
			Cancel : function() {
				$(this).dialog('close');
			}
		}
	}).keypress(
			function(e) {
				if (e.which == 13) {
					$(this).parents('.ui-dialog').first().find('.ui-button')
							.first().click();
				}
			});

	$('#dialog_create_room').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		open : function(event, ui) {
			$('#room_name').select();
			$('#room_name').removeClass('ui-state-error');
		},
		buttons : {
			OK : function() {
				var name = $('#room_name').val();
				if (name == '') {
					$('#room_name').addClass('ui-state-error');
				} else {
					self.createRoom(name);
					$(this).dialog('close');
				}
			},
			Cancel : function() {
				$(this).dialog('close');
			}
		}
	}).keypress(
			function(e) {
				if (e.which == 13) {
					$(this).parents('.ui-dialog').first().find(
							'.ui-button:contains(OK)').first().click();
				}
			});

	$('#room_type').buttonset();
	$('#create_room_advanced_content').hide();
	$('#create_room_advanced_button').button().click(function() {
		$('#create_room_advanced_content').toggle();
	}).button('disable'); // TODO Enable again :)

	$('#splash_name').keypress(
			function(e) {
				if (e.which == 13) {
					$(this).parents().first().find(
							'.ui-button:contains(Continue)').first().click();
				} else {
					$('#splash_name').removeClass('ui-state-error');
				}
			});

	$('#splash_continue').button().click(function() {
		var name = $('#splash_name').val();
		if (name != '') {
			self.ownName = name;
			self.loadMain();
		} else {
			// TODO Better error handling in the input boxes
			$('#splash_name').addClass('ui-state-error');
		}
	});
};

/**
 * Called when the user name doesn't exist in the storage.
 */
Lobby.prototype.loadSplash = function() {
	$('#main').hide();
	$('#top').hide();
	$('#call_list').hide();
	$('#tangible_status').hide();
	$('#roomFrame').hide();
	$('#splash').show();

	$('#splash_name').val(this.ownName);

	$('#splash_name').select();
};

/**
 * Called when the main page should be loaded.
 */
Lobby.prototype.loadMain = function() {
	// Make sure is shown properly
	$('#main').show();
	$('#top').show();
	$('#call_list').show();
	$('#tangible_status').show();
	$('#roomFrame').hide();
	$('#splash').hide();

	var self = this;

	if (socket.opened) {
		// See if the socket was already open
		this.onSocketOpen();
	}

	// Set up socket handlers
	socket.on('open', function() {
		self.onSocketOpen();
	});
	socket.on('close', function() {
		self.onSocketClose();
	});
	socket.on(API_NAME_SET, function(userName) {
		$('#display_user_name').text(userName);
	});
	socket.on(API_LIST, function(rooms, users) {
		self.onLobbyLoad(rooms, users);
	});
	socket.on(API_USER_ENTER, function(userId, userName, roomId) {
		self.onUserEnter(userId, userName, roomId);
	});
	socket.on(API_USER_LEAVE, function(userId) {
		self.onUserLeave(userId);
	});
	socket.on(API_NAME_CHANGE, function(userId, userName) {
		self.onUserChangeName(userId, userName);
	});
	socket.on(API_INVITE_SEND, function(userName, roomName, callId) {
		self.onIncomingCall(userName, roomName, callId);
	});
	socket.on(API_INVITE_ACCEPTED, function(roomId) {
		self.onCallAccepted(roomId);
	});
	socket.on(API_INVITE_DECLINED, function(callId) {
		self.onCallDeclined(callId);
	});
	socket.on(API_ROOM_NEW, function(roomId, roomName, roomDesc, roomType) {
		self.onRoomAdd(roomId, roomName, roomDesc, roomType);
	});
	socket.on(API_ROOM_REMOVE, function(roomId) {
		self.onRoomDelete(roomId);
	});

	// TODO this.onRoomCreated('random_text');
};

/**
 * Called when the socket connection is opened.
 */
Lobby.prototype.onSocketOpen = function() {
	console.log('onOpen');

	$('#dialog_error').dialog('close');

	// request stuff
	this.changeOwnName(this.ownName);
	socket.send(API_LIST, '');
};

/**
 * Called when the socket connection is closed.
 */
Lobby.prototype.onSocketClose = function() {
	console.warn('onClose');

	// TODO Fix better error handling?
	$('#room_table tbody').empty();
	$('#room_table tfoot').show();
};

/**
 * Searches for and returns the index if found, -1 otherwise.
 * 
 * @param roomId
 *            The ID to look for
 * @returns {Number}
 */
Lobby.prototype.findRoomIndex = function(roomId) {
	// Find room with given id
	for ( var i = 0; i < this.rooms.length; i++) {
		if (this.rooms[i][0] === roomId) {
			return i;
		}
	}
	return -1;
};

/**
 * Searches for and returns the index if found, -1 otherwise.
 * 
 * @param userId
 *            The ID to look for
 * @returns {Number}
 */
Lobby.prototype.findUserIndex = function(userId) {
	// Find remote_user with given id
	for ( var i = 0; i < this.users.length; i++) {
		if (this.users[i][0] === userId) {
			return i;
		}
	}
	return -1;
};

/**
 * Changes the user name to a new name if it isn't the empty string. Called when
 * the user clicks OK in the select user name dialog.
 * 
 * @param newName
 *            The new user name
 */
Lobby.prototype.changeOwnName = function(newName) {
	console.log('onchangeOwnName: ' + newName);

	if (newName != '') {
		this.ownName = newName;
		sessionStorage.ownName = newName;
		$('#display_user_name').text(this.ownName);

		socket.send(API_NAME_SET, JSON.stringify({
			name : this.ownName
		}));
	}
};

/**
 * Adds all rooms and remote users to the page. Should be called when the page
 * is loaded.
 * 
 * @param rooms
 *            A list of rooms
 * @param users
 *            A list of users
 */
Lobby.prototype.onLobbyLoad = function(rooms, users) {
	console.log('onLobbyLoad: ' + rooms + ' ' + users);

	this.rooms = [];
	this.users = [];

	$('#room_table tbody').empty();
	$('#room_table tfoot').show();

	// Add rooms
	for ( var i = 0; i < rooms.length; i++) {
		this.onRoomAdd(rooms[i][0], rooms[i][1], rooms[i][2], rooms[i][3]);
	}

	// Add users
	for ( var i = 0; i < users.length; i++) {
		this.onUserEnter(users[i][0], users[i][1], users[i][2]);
	}
};

/**
 * Lets the user select a room name. The room is then created. Called when the
 * create room button is clicked.
 * 
 * @param roomName
 *            Name of the new room
 */
Lobby.prototype.createRoom = function(roomName) {
	console.log('createRoom: ' + roomName);

	var roomType;
	if ($('#room_type_private').attr('checked')) {
		roomType = this.room_type_private;
	} else {
		roomType = this.room_type_public;
	}

	var roomDesc = $('#room_desc').val();
	var roomPassword = $('#room_password').val();

	if (roomName != '') {
		socket.send(API_ROOM_NEW, JSON.stringify({
			name : roomName,
			type : roomType,
			desc : roomDesc,
			password : roomPassword
		}));
	}
};

/**
 * Deletes a room on the server.
 * 
 * @param roomId
 *            ID to delete
 */
Lobby.prototype.deleteRoom = function(roomId) {
	console.log('deleteRoom: ' + roomId);

	socket.send(API_ROOM_REMOVE, JSON.stringify({
		id : roomId
	}));
};

/**
 * Callback function for when the room has been created. The user will be
 * redirected to the new room.
 * 
 * @param roomId
 *            ID of the room created.
 */
Lobby.prototype.onRoomCreated = function(roomId) {
	this.enterRoom(roomId);
};

/**
 * Redirects the user to a room with a given id.
 * 
 * @param roomId
 *            ID of the room
 */
Lobby.prototype.enterRoom = function(roomId) {
	socket.send(API_USER_CHANGE, JSON.stringify({
		id : roomId
	}));

	$('#main').hide();
	$('#roomFrame').show();
	$('#roomFrame').attr('src', 'room/#' + roomId);
};

/**
 * Is called by the room frame content when it wants to close the room.
 */
Lobby.prototype.leaveRoom = function() {
	socket.send(API_USER_CHANGE, JSON.stringify({
		id : this.lobbyId
	}));

	$('#roomFrame').attr('src', 'about:blank');
	$('#main').show();
	$('#roomFrame').hide();
};

/**
 * Changes the name of a room.
 * 
 * @param roomId
 *            ID of the room
 * @param roomName
 *            The new name
 */
Lobby.prototype.onRoomChangeName = function(roomId, roomName) {
	console.log('onRoomChangeName: ' + roomId + ' ' + roomName);

	var index = this.findRoomIndex(roomId);
	if (index != -1) {
		this.rooms[index][1] = roomName;
		$('#room_list_' + roomId + ' h3').text(roomName);
	}
};

/**
 * Adds a room to the page if the ID doesn't exist. Should be called when a new
 * room is available on the server.
 * 
 * @param roomId
 *            ID of the added room
 * @param roomName
 *            Name of the added room
 * @param roomDesc
 *            The description of the room
 * @param roomType
 *            Type of the room
 */
Lobby.prototype.onRoomAdd = function(roomId, roomName, roomDesc, roomType) {
	console.log('onRoomAdd: ' + roomId + ' ' + roomName + ' ' + roomDesc + ' '
			+ roomType);

	// Ignore lobby
	if (roomId == this.lobbyId) {
		// return; TODO Uncomment again...
	}
	// Unique ids
	if ($('#room_list_' + roomId).length != 0) {
		return;
	}

	$('#room_table tfoot').hide();

	var self = this;
	// Add to list
	this.rooms.push([ roomId, roomName, roomDesc, roomType ]);
	$('#room_table tbody').append($('<tr/>', {
		id : 'room_list_' + roomId,
		click : function() {
			self.onRoomClick(roomId);
		}
	}).append($('<td/>').append($('<h3/>', {
		text : roomName
	})).append(roomDesc)).append($('<td/>', {
		id : 'room_user_list_' + roomId
	})).append($('<td/>').css({
		width : '26px',
		'font-size' : '0px'
	}).append($('<button/>').button({
		icons : {
			primary : 'ui-icon-trash'
		},
		text : false
	}).css({
		height : '26px',
		width : '26px'
	}).click(function(event) {
		event.stopPropagation();
		self.deleteRoom(roomId);
	}))));
};

/**
 * Deletes a room from the page. Should be called when a room is deleted on the
 * server.
 * 
 * @param roomId
 *            ID of the deleted room
 */
Lobby.prototype.onRoomDelete = function(roomId) {
	console.log('onRoomDelete: ' + roomId);

	// Find room with given id
	var index = this.findRoomIndex(roomId);
	if (index != -1) {
		// Remove from list
		this.rooms.splice(index, 1);
		$('#room_list_' + roomId).remove();

		if (this.rooms.length == 0) {
			$('#room_table tfoot').show();
		}
	}
};

/**
 * Called when a room is clicked.
 * 
 * @param roomId
 *            ID of the room
 */
Lobby.prototype.onRoomClick = function(roomId) {
	console.log('onRoomClick: ' + roomId);

	var index = this.findRoomIndex(roomId);
	if (index != -1) {
		console.log('RoomClick found: ' + this.rooms[index][0]);
		this.enterRoom(roomId);
	}
};

/**
 * Called when a user enters a room.
 * 
 * @param userId
 *            ID of the user
 * @param roomId
 *            ID of the room
 */
Lobby.prototype.onUserEnterRoom = function(userId, roomId) {
	console.log('onUserEnterRoom: ' + userId + ' ' + roomId);

	var index = this.findRoomIndex(roomId);
	if (index != -1) {
		var user_index = this.findUserIndex(userId);
		if (user_index != -1) {
			this.users[user_index][2] = roomId;

			// Make sure each user only exist in one room in the list
			$('.remote_user_' + this.users[user_index][0]).remove();

			$('#room_user_list_' + roomId).append($('<span/>', {
				class : 'remote_user_' + this.users[user_index][0],
				text : this.users[user_index][1] + ' '
			}));
		}
	}
};

/**
 * Called when the user leaves a room.
 * 
 * @param userId
 *            ID of the user
 */
Lobby.prototype.onUserLeaveRoom = function(userId) {
	console.log('onUserLeaveRoom: ' + userId);

	var user_index = this.findUserIndex(userId);
	if (user_index != -1) {
		this.users[user_index][2] = 0;

		// Remove the user from the list
		$('.remote_user_' + this.users[user_index][0]).remove();
	}
};

/**
 * Changes the name of a remote user.
 * 
 * @param userId
 *            Users ID
 * @param userName
 *            The new name
 */
Lobby.prototype.onUserChangeName = function(userId, userName) {
	console.log('onUserChangeName: ' + userId + ' ' + userName);

	var index = this.findUserIndex(userId);
	if (index != -1) {
		this.users[index][1] = userName;
		$('span.remote_user_' + userId).text(userName + ' ');
	}
};

/**
 * Adds a remote user to the list. Should be called when a user enters the
 * server.
 * 
 * @param userId
 *            ID of the remote user that entered
 * @param userName
 *            Name of the remote user that entered
 * @param roomId
 *            ID of the room which contains the user
 */
Lobby.prototype.onUserEnter = function(userId, userName, roomId) {
	console.log('onUserEnter: ' + userId + ' ' + userName + ' ' + roomId);

	// Add to list
	this.users.push([ userId, userName, roomId ]);

	this.onUserEnterRoom(userId, roomId);
};

/**
 * Removes a remote user from the list. Should be called when a user leaves the
 * server.
 * 
 * @param userId
 *            ID of the remote user that left
 */
Lobby.prototype.onUserLeave = function(userId) {
	console.log('onUserLeave: ' + userId);

	// Find remote_user with given id
	var index = this.findUserIndex(userId);
	if (index != -1) {
		// Remove from list
		this.users.splice(index, 1);
		$('.remote_user_' + userId).remove();
	}
};

/**
 * Notifies the user that there is an incoming call. A call is auto-declined
 * after a specified time. Should be called when the user has been invited to a
 * room.
 * 
 * @param userName
 *            Name of the inviter
 * @param roomName
 *            Name of the room
 * @param callId
 *            ID of the call
 */
Lobby.prototype.onIncomingCall = function(userName, roomName, callId) {
	console.log('IncomingCall: ' + userName + ' ' + roomName + ' ' + callId);

	// Unique ids
	if ($('#call_' + callId).length != 0) {
		return;
	}

	var self = this;

	// Insert above
	$('<div/>', {
		id : 'call_' + callId,
		text : userName + ' invited you to ' + roomName + '.'
	}).append($('<button/>', {
		text : 'Accept',
		click : function() {
			self.accept(callId);
		}
	}).button()).append($('<button/>', {
		text : 'Decline',
		click : function() {
			self.decline(callId);
		}
	}).button()).append($('<div/>', {
		id : 'call_timer_' + callId
	}).css({
		display : 'inline',
		color : 'red'
	})).hide().prependTo('#call_list');

	// Effect
	$('#call_' + callId).show('drop');

	// Auto-decline after x seconds
	this.onAutoDeclineTimer(callId, this.AUTO_DECLINE_TIME);
};

/**
 * Removes the notification and accepts the call. Called when the user clicked
 * accept.
 * 
 * @param callId
 *            ID of the call that was accepted
 */
Lobby.prototype.accept = function(callId) {
	console.log('Accept: ' + callId);

	if ($('#call_' + callId).length != 0) { // Extra check
		$('#call_timer_' + callId).text('');

		// send answer
		socket.send(API_INVITE_ANSWER, JSON.stringify({
			callId : callId,
			answer : 'yes'
		}));

		$('#call_' + callId).removeAttr('id').hide({
			effect : 'drop',
			complete : function() {
				$(this).remove();
			}
		});
	}
};

/**
 * Callback function for when the call has been accepted. The user will be
 * redirected to the room.
 * 
 * @param roomId
 */
Lobby.prototype.onCallAccepted = function(roomId) {
	this.enterRoom(roomId);
};

/**
 * Callback function for when the call has been declined. This will just remove
 * the call div.
 * 
 * @param callId
 */
Lobby.prototype.onCallDeclined = function(callId) {
	if ($('#call_' + callId).length != 0) { // Extra check
		$('#call_' + callId).removeAttr('id').hide({
			effect : 'drop',
			complete : function() {
				$(this).remove();
			}
		});
	}
};

/**
 * Removes the notification and declines the call. Called when the user clicked
 * decline or when the timeout expired.
 * 
 * @param callId
 *            ID of the call that was declined
 */
Lobby.prototype.decline = function(callId) {
	console.log('Decline: ' + callId);

	if ($('#call_' + callId).length != 0) { // Extra check
		$('#call_timer_' + callId).text('');

		// send answer
		socket.send(API_INVITE_ANSWER, JSON.stringify({
			callId : callId,
			answer : 'no'
		}));

		$('#call_' + callId).removeAttr('id').hide({
			effect : 'drop',
			complete : function() {
				$(this).remove();
			}
		});
	}
};

/**
 * Counts down the auto-decline timeout by one second. A counter is displayed
 * when there its less or equal to 10 seconds remaining.
 * 
 * @param callId
 *            ID of the call
 * @param timeLeft
 *            Number of seconds left on the timeout
 */
Lobby.prototype.onAutoDeclineTimer = function(callId, timeLeft) {
	if ($('#call_timer_' + callId).length != 0) {
		// Might have been manually declined
		var newTimeLeft = timeLeft - 1;
		if (newTimeLeft <= 0) { // Time is up, decline
			this.decline(callId);
		} else {
			if (newTimeLeft <= 10) { // Only display last 10 seconds
				$('#call_timer_' + callId).text(newTimeLeft);
			}

			var self = this;
			setTimeout(function() {
				self.onAutoDeclineTimer(callId, newTimeLeft);
			}, 1000);
		}
	}
};

/**
 * A test function which runs various functions in the lobby.
 */
Lobby.prototype.test = function() {
	console.log('Running test...');

	this.onLobbyLoad([ [ 1, 'Test Room', '', 0 ],
			[ 2, 'Room 2', 'Some desc', 0 ] ], [ [ 1, 'Karl', 1 ],
			[ 2, 'Jonas', 1 ] ]);

	this.changeOwnName('Test name');

	this.onIncomingCall('Kalle', 'Room test', 1);

	// Test rooms
	assert(this.findRoomIndex(1) == 0, 'Room index of 1 is wrong');
	assert(this.rooms[0][1] == 'Test Room', 'Room has wrong name');
	assert(this.rooms[1][2] == 'Some desc', 'Room has wrong desc');
	assert(this.rooms[0][3] == 0, 'Room has wrong type');
	this.onRoomAdd(3, 'Room 3', 'Desc', 1);
	this.onRoomChangeName(1, 'New name');
	assert(this.rooms[0][1] == 'New name', 'Room has wrong name after change');
	this.onRoomAdd(4, 'Delete me', 'Desc', 1);
	this.onRoomDelete(4);
	assert(this.rooms.length == 3, 'Room wasnt removed');

	// Test users
	assert(this.findUserIndex(1) == 0, 'User index of 1 is wrong');
	assert(this.users[0][1] == 'Karl', 'User has wrong name');
	assert(this.users[0][2] == 1, 'User has wrong room_id');
	this.onUserEnter(3, 'User 3', 2);
	this.onUserLeave(3);
	assert(this.users.length == 2, 'User wasnt removed');
	this.onUserEnter(4, 'User 4', 3);
	this.onUserChangeName(4, 'New user 4');
	assert(this.users[this.findUserIndex(4)][1] == 'New user 4',
			'User has wrong name after change');
	this.onUserEnterRoom(4, 1);
	this.onUserLeaveRoom(4);
	assert(this.users[this.findUserIndex(4)][2] == 0, 'User didnt leave room');
};
