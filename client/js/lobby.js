var lobby; // Global object for the lobby

$(function() {
	lobby = new Lobby();
	lobby.init();
});

function Lobby() {
	this.DEBUG = false;
	this.AUTO_DECLINE_TIME = 60; // Time until a call is auto declined
	this.lobbyId = 0; // Special room id for the lobby
	this.ownRoomId = 0; // Own users current room Id
	this.ownId = -1; // Own users Id
	this.rooms = []; // [id, name, desc, type]
	this.users = []; // [id, name, room_id]
	this.hideRoomHeader = true;
	this.workspaceOpen = false;
	this.chatOpen = false;
	this.workspaceWindow = undefined;
	if (sessionStorage.ownName) { // TODO Change all session to localStorage?
		this.ownName = sessionStorage.ownName;
	} else {
		this.ownName = 'User#' + Math.floor((Math.random() * 999) + 1);
	}
}

/**
 * Initializes all the dialogs, DIVs etc.
 */
Lobby.prototype.init = function() {
	var self = this;
	
	// Automatically close the workspace
	window.onbeforeunload = function() {
		if(self.workspaceOpen) {
			self.workspaceWindow.close();
		}
	};
	
	$('#room_password, label[for=room_password]').hide(); // TODO Fix passwords?

	$('#main, #top, #call_list, #roomFrame, #splash, #room_toolbar, #roomFrame, #room_table tfoot, #tangible_status').hide();

	$('#display_user_name').text(this.ownName);

	$('#create_room, #change_user_name').button();
	$('#create_room').click(function() {
		$('#dialog_create_room').dialog('open');
	});
	$('#change_user_name').click(function() {
		$('#dialog_select_user_name').dialog('open');
	});

	$('#dialog_user_invite').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		open : function(event, ui) {
			$(this).empty();
			// TODO Append with new users??

			var empty = true;

			for ( var i = 0; i < self.users.length; i++) {
				if (self.users[i][0] != self.ownId) {
					empty = false;
					$(this).append($('<div/>', {
						class : 'remote_user_' + self.users[i][0]
					}).append($('<input/>', {
						type : 'checkbox',
						id : 'check_invite_' + self.users[i][0]
					})).append($('<label/>', {
						'for' : 'check_invite_' + self.users[i][0]
					}).append($('<span/>', {
						class : 'remote_user_' + self.users[i][0],
						text : self.users[i][1]
					}))));
				}
			}
			if (empty) {
				$(this).append('No users available.');
			}
		},
		buttons : {
			OK : function() {
				$(this).dialog('close');
				$(this).find('input[type="checkbox"]').each(function() {
					if ($(this).is(':checked')) {
						var divId = $(this).attr('id');
						var index = divId.indexOf('check_invite_');
						if (index == 0) {
							var userId = divId.substring(index + 13);
							// 13 = 'check_invite_'.length

							self.inviteUser(userId);
						}
					}
				});
			},
			Cancel : function() {
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
	}).keypress(function(e) {
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
	}).keypress(function(e) {
		if (e.which == 13) {
			$(this).parents('.ui-dialog').first().find(
				'.ui-button:contains(OK)').first().click();
		}
	});

	$('#splash_name').keypress(function(e) {
		if (e.which == 13) {
			$('#splash_continue').click();
		} else {
			$('#splash_name').removeClass('ui-state-error');
		}
	});

	$('#splash_continue').button().click(function() {
		var name = $('#splash_name').val();
		if (name != '') {
			self.changeOwnName(name);
			self.loadMain();
		} else {
			// TODO Better error handling in the input boxes
			$('#splash_name').addClass('ui-state-error');
		}
	});


	$('#dialog_tangible_status').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		open : function(event, ui) {
			$('.status',this).text($('#tangible_status').attr('title'));
		},
		buttons : {
			OK : function() {
				$(this).dialog('close');
			}
		}
	});
	$('#tangible_status').button({
		icons : { primary : 'ui-icon-tangiblestatus-ok' }
	}).click(function() {
		$('#dialog_tangible_status').dialog('open');
	});


	$('#toggle_workspace').button({
		icons : { primary : 'ui-icon-newwin' },
		text : false
	}).click(function() {
		self.workspaceOpen = !self.workspaceOpen;
		if (self.workspaceOpen) {
			self.workspaceWindow = window.open('/workspace/#'
					+ self.ownRoomId + '_desk');
			self.workspaceWindow.onbeforeunload = function() {
				if (self.workspaceOpen) {
					$('label[for=toggle_workspace]').removeClass(
							'ui-state-hover');
					self.workspaceOpen = false;
					self.updateWorkspaceButton();
				}
			};
		} else {
			self.workspaceWindow.close();
		}
		self.updateWorkspaceButton();
	});
	$('#toggle_chat').button({
		icons : { primary : 'ui-icon-comment' },
		text : false
	}).click(function() {
		self.chatOpen = !self.chatOpen;
		if (self.chatOpen) {
			$('#roomFrame').contents().find('#chatbox').show();
			$('#roomFrame').contents().find('#chatinput').focus();
		} else {
			$('#roomFrame').contents().find('#chatbox').hide();
		}
		self.updateChatButton();
	});
	$('#room_invite').button({
		icons : { primary : 'ui-icon-plus' },
		text : false
	}).click(function() {
		$('#dialog_user_invite').dialog('open');
	});
	$('#room_leave').button({
		icons : { primary : 'ui-icon-home' },
		text : false
	}).click(function() {
		self.leaveRoom();
	});

	$('#toggle_header').button({
		icons : { primary : 'ui-icon-arrowthick-1-s' },
		text : false
	}).click(function() {
		self.hideRoomHeader = !self.hideRoomHeader;
		self.updateRoomToolbar();
		$(this).removeClass('ui-state-hover');
	});

	/*
	 * Initialize socket stuff
	 */
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

	socket.on(API_USERID, function(userId) {
		self.ownId = userId;
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
	
	// TODO Handle passwords when entering rooms
};

/**
 * Called when the user name doesn't exist in the storage.
 */
Lobby.prototype.loadSplash = function() {
	$('#title').text('Welcome');

	$('#roomFrame').attr('src', 'about:blank');

	$('#main, #top, #room_toolbar, #call_list, #roomFrame, #tangible_status').hide();
	$('#header, #splash').show();

	$('#splash_name').focus();
};

/**
 * Called when the main page should be loaded.
 */
Lobby.prototype.loadMain = function() {
	$('#title').text('Lobby');

	$('#roomFrame').attr('src', 'about:blank');

	$('#header, #main, #top, #call_list, #tangible_status').show();
	$('#room_toolbar, #roomFrame, #splash').hide();
	
	this.hideRoomHeader = false;
	this.updateRoomToolbar();

	this.closeWorkspace();
};

/**
 * Called when the socket connection is opened.
 */
Lobby.prototype.onSocketOpen = function() {
	if (this.DEBUG) {
		console.debug('onOpen');
	}

	$('#server_loading').hide();

	if (sessionStorage.ownName) {
		this.changeOwnName(this.ownName);
		lobby.loadMain();
	} else {
		lobby.loadSplash();
	}

	// request stuff
	socket.send(API_LIST, '');
};

/**
 * Called when the socket connection is closed.
 */
Lobby.prototype.onSocketClose = function() {
	if (this.DEBUG) {
		console.debug('onClose');
	}

	$('#server_loading').show();

	// TODO Fix so it stays in the room?

	$('#main, #top, #call_list, #roomFrame, #splash').hide();

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
		if (this.rooms[i][0] == roomId) {
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
		if (this.users[i][0] == userId) {
			return i;
		}
	}
	return -1;
};

/**
 * Gets a list of all users in a room.
 * 
 * @param roomId
 *            Room to look for
 * @returns {Array}
 */
Lobby.prototype.getUsersInRoom = function(roomId) {
	var users = [];
	for ( var i = 0; i < this.users.length; i++) {
		if (this.users[i][2] == roomId) {
			users.push(this.users[i]);
		}
	}
	return users;
};

/**
 * Changes the user name to a new name if it isn't the empty string. Called when
 * the user clicks OK in the select user name dialog.
 * 
 * @param newName
 *            The new user name
 */
Lobby.prototype.changeOwnName = function(newName) {
	if (this.DEBUG) {
		console.debug('onchangeOwnName: ' + newName);
	}

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
	if (this.DEBUG) {
		console.debug('onLobbyLoad: ' + rooms + ' ' + users);
	}

	this.rooms = [];
	this.users = [];

	$('#room_user_list_0').empty();
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
	if (this.DEBUG) {
		console.debug('createRoom: ' + roomName);
	}

	var roomDesc = $('#room_desc').val();
	var roomPassword = $('#room_password').val();

	if (roomName != '') {
		socket.send(API_ROOM_NEW, JSON.stringify({
			name : roomName,
			type : '',
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
	if (this.DEBUG) {
		console.debug('deleteRoom: ' + roomId);
	}

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
	this.ownRoomId = roomId;

	if (roomId == this.lobbyId) {
		return;
	}

	this.closeWorkspace();
	this.chatOpen = false;

	socket.send(API_USER_CHANGE, JSON.stringify({
		id : roomId
	}));

	var roomName = 'Room';
	var index = this.findRoomIndex(roomId);
	if (index != -1) {
		roomName = this.rooms[index][1];
	}
	$('#title').html(
			'<span class="room_' + roomId + '">' + roomName + '</span>');

	$('#room_toolbar').show();
	
	$('#room_leave').removeClass('ui-state-hover');
	
	this.hideRoomHeader = true;
	this.updateRoomToolbar();
	$('#main').hide();
	$('#roomFrame').show();
	$('#roomFrame').attr('src', 'room/#' + roomId);
};

/**
 * Is called by the room frame content when it wants to close the room.
 */
Lobby.prototype.leaveRoom = function() {
	this.ownRoomId = 0;

	socket.send(API_USER_CHANGE, JSON.stringify({
		id : this.lobbyId
	}));

	$('#title').text('Lobby');

	this.hideRoomHeader = false;
	this.updateRoomToolbar();

	$('#room_toolbar').hide();

	this.closeWorkspace();

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
	if (this.DEBUG) {
		console.debug('onRoomChangeName: ' + roomId + ' ' + roomName);
	}

	$('.room_' + roomId).text(roomName);

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
	if (this.DEBUG) {
		console.debug('onRoomAdd: ' + roomId + ' ' + roomName + ' ' + roomDesc
				+ ' ' + roomType);
	}

	// Ignore lobby
	if (roomId == this.lobbyId) {
		return;
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
		id : 'room_user_list_' + roomId,
		class : 'remote_user_list'
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
	if (this.DEBUG) {
		console.debug('onRoomDelete: ' + roomId);
	}

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
	if (this.DEBUG) {
		console.debug('onRoomClick: ' + roomId);
	}

	var index = this.findRoomIndex(roomId);
	if (index != -1) {
		if (this.DEBUG) {
			console.debug('RoomClick found: ' + this.rooms[index][0]);
		}
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
	if (this.DEBUG) {
		console.debug('onUserEnterRoom: ' + userId + ' ' + roomId);
	}

	var index = this.findRoomIndex(roomId);
	if (index != -1 || roomId == this.lobbyId) { // Special case for the lobby
		var user_index = this.findUserIndex(userId);
		if (user_index != -1) {
			this.users[user_index][2] = roomId;

			// Make sure each user only exist in one room in the list
			$('.remote_user_' + this.users[user_index][0]).remove();

			$('#room_user_list_' + roomId).append($('<div/>', {
				class : 'remote_user_' + this.users[user_index][0]
			}).css({
				display : 'inline'
			}).append($('<span/>', {
				class : 'remote_user_' + this.users[user_index][0],
				text : this.users[user_index][1]
			})).append($('<span/>', {
				text : ', '
			})));
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
	if (this.DEBUG) {
		console.debug('onUserLeaveRoom: ' + userId);
	}

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
	if (this.DEBUG) {
		console.debug('onUserChangeName: ' + userId + ' ' + userName);
	}

	var index = this.findUserIndex(userId);
	if (index != -1) {
		this.users[index][1] = userName;
		$('span.remote_user_' + userId).text(userName);
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
	if (this.DEBUG) {
		console.debug('onUserEnter: ' + userId + ' ' + userName + ' ' + roomId);
	}

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
	if (this.DEBUG) {
		console.debug('onUserLeave: ' + userId);
	}

	// Find remote_user with given id
	var index = this.findUserIndex(userId);
	if (index != -1) {
		// Remove from list
		this.users.splice(index, 1);
		$('.remote_user_' + userId).remove();
	}
};

/**
 * Invites a user to the current room if it exists.
 * 
 * @param userId
 *            The user to be invited
 */
Lobby.prototype.inviteUser = function(userId) {
	if (this.DEBUG) {
		console.debug('inviteUser: ' + userId);
	}

	var index = this.findUserIndex(userId);

	if (index != -1) {
		socket.send(API_INVITE_SEND, JSON.stringify({
			id : this.users[index][0],
			roomId : this.ownRoomId
		}));
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
	if (this.DEBUG) {
		console.debug('IncomingCall: ' + userName + ' ' + roomName + ' '
				+ callId);
	}

	// Unique ids
	if ($('#call_' + callId).length != 0) {
		return;
	}

	var self = this;

	// Insert above
	$('<div/>', {
		id : 'call_' + callId,
		text : userName + ' invited you to ' + roomName + '.'
	}).css({
		padding : '5px'
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
	if (this.DEBUG) {
		console.debug('Accept: ' + callId);
	}

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
	if (this.DEBUG) {
		console.debug('Decline: ' + callId);
	}

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
 * Closes the workspace if its open.
 */
Lobby.prototype.closeWorkspace = function() {
	if (this.workspaceOpen) {
		this.workspaceWindow.close();
		this.workspaceOpen = false;
	}
};

/**
 * Updates the icons of the room toolbar.
 */
Lobby.prototype.updateRoomToolbar = function() {
	if (this.hideRoomHeader) {
		$('#title').addClass('small');
		$('#header .expanded').hide();
		$('#header .small').show();
		$('#header').css('height', '30px');
	} else {
		$('#title').removeClass('small');
		$('#header .expanded').show();
		$('#header .small').hide();
		$('#header').css('height', '');
	}
	
	this.updateChatButton();

	this.updateWorkspaceButton();
	$('#header #toolbar button:not(:last)').button('option',
		{ text : !this.hideRoomHeader });

	$('#toggle_header').button('option', {
		icons : {
			primary : 'ui-icon-arrowthick-1-'+(this.hideRoomHeader ? 's' : 'n')
		},
		label : (this.hideRoomHeader ? 'Show the header' : 'Hide the header')
	});
};

/**
 * Updates the apperance of the workspace button.
 */
Lobby.prototype.updateWorkspaceButton = function() {
	$('#toggle_workspace').attr('checked', this.workspaceOpen)
		.button('refresh');
	$('#toggle_workspace').button('option', {
		text : !this.hideRoomHeader,
		label : (this.workspaceOpen ? 'Close workspace' : 'Open workspace')
	});

	// Special fix for label bug
	$('label[for=toggle_workspace]').attr('title',
		this.workspaceOpen ? 'Close workspace' : 'Open workspace');
};


/**
 * Updates the apperance of the chat button.
 */
Lobby.prototype.updateChatButton = function() {
	$('#roomFrame').contents().find('#chatbox').css({
		top: (this.hideRoomHeader ? '31px' : '91px')
	});
	$('#toggle_chat').attr('checked', this.chatOpen)
		.button('refresh');
	$('#toggle_chat').button('option', {
		text : !this.hideRoomHeader,
		label : (this.chatOpen ? 'Close chat' : 'Open chat')
	});

	// Special fix for label bug
	$('label[for=toggle_chat]').attr('title',
		this.chatOpen ? 'Close chat' : 'Open chat');
};


/**
 * A test function which runs various functions in the lobby.
 */
Lobby.prototype.test = function() {
	if (this.DEBUG) {
		console.debug('Running test...');
	}

	this.onLobbyLoad([ [ 1, 'Test Room', '', 0 ],
			[ 2, 'Room 2', 'Some desc', 0 ] ], [ [ 1, 'Karl', 1 ],
			[ 2, 'Jonas', 1 ] ]);

	this.changeOwnName('Test name');

	this.onIncomingCall('Kalle', 'Room test', 1);

	// Test rooms
	console.assert(this.findRoomIndex(1) == 0, 'Room index of 1 is wrong');
	console.assert(this.rooms[0][1] == 'Test Room', 'Room has wrong name');
	console.assert(this.rooms[1][2] == 'Some desc', 'Room has wrong desc');
	console.assert(this.rooms[0][3] == 0, 'Room has wrong type');
	this.onRoomAdd(3, 'Room 3', 'Desc', 1);
	this.onRoomChangeName(1, 'New name');
	console.assert(this.rooms[0][1] == 'New name',
			'Room has wrong name after change');
	this.onRoomAdd(4, 'Delete me', 'Desc', 1);
	this.onRoomDelete(4);
	console.assert(this.rooms.length == 3, 'Room wasnt removed');

	// Test users
	console.assert(this.findUserIndex(1) == 0, 'User index of 1 is wrong');
	console.assert(this.users[0][1] == 'Karl', 'User has wrong name');
	console.assert(this.users[0][2] == 1, 'User has wrong room_id');
	this.onUserEnter(3, 'User 3', 2);
	this.onUserLeave(3);
	console.assert(this.users.length == 2, 'User wasnt removed');
	this.onUserEnter(4, 'User 4', 3);
	this.onUserChangeName(4, 'New user 4');
	console.assert(this.users[this.findUserIndex(4)][1] == 'New user 4',
			'User has wrong name after change');
	this.onUserEnterRoom(4, 1);
	this.onUserLeaveRoom(4);
	console.assert(this.users[this.findUserIndex(4)][2] == 0,
			'User didnt leave room');
};
