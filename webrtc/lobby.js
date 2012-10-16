var lobby; // Global object for the lobby

$(function() {
	lobby = new Lobby();
	lobby.load();
});

function Lobby() {
	this.auto_decline_time = 60;
	this.rooms = []; // [id, name, desc, type]
	this.remote_users = []; // [id, name, room_id]
	this.user_name = "User#" + Math.floor((Math.random() * 999) + 1);
}

/**
 * Shows a dialog with the text.
 * 
 * @param text
 *            The text to display.
 */
function showError(text) {
	$("#dialog_error_text").text(text);
	$("#dialog_error").dialog("open");
}

Lobby.prototype.load = function() {
	var self = this;

	// Set up socket handlers
	socket.on("open", function() {
		self.onSocketOpen();
	});
	socket.on("close", function() {
		self.onSocketClose();
	});
	socket.on(API_SET_NAME, function(user_name) {
		$("#display_user_name").text(user_name);
	});
	socket.on(API_LIST, function(rooms, remote_users) {
		self.onLobbyLoad(rooms, remote_users);
	});

	$("#room_table tfoot").hide();

	$("#display_user_name").text(this.user_name);

	$("#create_room, #change_user_name").button();
	$("#create_room").click(function() {
		$("#dialog_create_room").dialog("open");
	});
	$("#change_user_name").click(function() {
		$("#dialog_select_user_name").dialog("open");
	});

	$("#dialog_error").dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		buttons : {
			OK : function() {
				$(this).dialog("close");
			}
		}
	});

	$("#dialog_select_user_name").dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		open : function(event, ui) {
			$("#user_name").val(self.user_name);
			$("#user_name").removeClass("ui-state-error");
		},
		buttons : {
			OK : function() {
				var name = $("#user_name").val();
				if (name == "") {
					$("#user_name").addClass("ui-state-error");
				} else {
					self.changeUserName(name);
					$(this).dialog("close");
				}
			},
			Cancel : function() {
				$(this).dialog("close");
			}
		}
	}).keypress(
			function(e) {
				if (e.which == 13) {
					$(this).parents('.ui-dialog').first().find('.ui-button')
							.first().click();
				}
			});

	$("#dialog_create_room").dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		open : function(event, ui) {
			$("#room_name").removeClass("ui-state-error");
		},
		buttons : {
			OK : function() {
				var name = $("#room_name").val();
				if (name == "") {
					$("#room_name").addClass("ui-state-error");
				} else {
					self.onCreateRoom(name);
					$(this).dialog("close");
				}
			},
			Cancel : function() {
				$(this).dialog("close");
			}
		}
	}).keypress(
			function(e) {
				if (e.which == 13) {
					$(this).parents('.ui-dialog').first().find('.ui-button')
							.first().click();
				}
			});

};

/**
 * Called when the socket connection is opened.
 */
Lobby.prototype.onSocketOpen = function() {
	console.log("onOpen");

	// request stuff
	this.changeUserName(this.user_name);
	socket.send(API_LIST, "");
};

/**
 * Called when the socket connection is closed.
 */
Lobby.prototype.onSocketClose = function() {
	console.log("onClose");

	showError("Lost server connection...");
};

/**
 * Searches for and returns the index if found, -1 otherwise.
 * 
 * @param room_id
 *            The ID to look for
 * @returns {Number}
 */
Lobby.prototype.findRoomIndex = function(room_id) {
	// Find room with given id
	for ( var i = 0; i < this.rooms.length; i++) {
		if (this.rooms[i][0] === room_id) {
			return i;
		}
	}
	return -1;
};

/**
 * Searches for and returns the index if found, -1 otherwise.
 * 
 * @param remote_user_id
 *            The ID to look for
 * @returns {Number}
 */
Lobby.prototype.findRemoteUserIndex = function(remote_user_id) {
	// Find remote_user with given id
	for ( var i = 0; i < this.remote_users.length; i++) {
		if (this.remote_users[i][0] === remote_user_id) {
			return i;
		}
	}
	return -1;
};

/**
 * Changes the user name to a new name if it isn't the empty string. Called when
 * the user clicks OK in the select user name dialog.
 * 
 * @param new_name
 *            The new user name
 */
Lobby.prototype.changeUserName = function(new_name) {
	console.log("onChangeUserName: " + new_name);

	if (new_name != "") {
		this.user_name = new_name;
		$("#display_user_name").text(this.user_name);

		socket.send(API_SET_NAME, JSON.stringify({
			name : this.user_name
		}));
	}
};

/**
 * Adds all rooms and remote users to the page. Should be called when the page
 * is loaded.
 * 
 * @param rooms
 *            A list of rooms
 * @param remote_users
 *            A list of users
 */
Lobby.prototype.onLobbyLoad = function(rooms, remote_users) {
	console.log("onLobbyLoad: " + rooms + " " + remote_users);

	this.rooms = [];
	this.remote_users = [];

	$("#room_table tbody").empty();
	$("#room_table tfoot").show();

	// Add rooms
	for ( var i = 0; i < rooms.length; i++) {
		this.onRoomAdd(rooms[i][0], rooms[i][1], rooms[i][2], rooms[i][3]);
	}

	// Add users
	for ( var i = 0; i < remote_users.length; i++) {
		this.onRemoteUserEnter(remote_users[i][0], remote_users[i][1],
				remote_users[i][2]);
	}
};

/**
 * Lets the user select a room name. The room is then created. Called when the
 * create room button is clicked.
 * 
 * @param room_name
 *            Name of the new room
 */
Lobby.prototype.onCreateRoom = function(room_name) {
	console.log("onCreateRoom: " + room_name);

	if (room_name != "") {
		// TODO Create room
		this.onRoomCreated("random_text");
	}
};

/**
 * Callback function for when the room has been created. The user will be
 * redirected to the new room.
 * 
 * @param room_id
 *            ID of the room created.
 */
Lobby.prototype.onRoomCreated = function(room_id) {
	this.enterRoom(room_id);
};

/**
 * Redirects the user to a room with a given id.
 * 
 * @param room_id
 *            ID of the room
 */
Lobby.prototype.enterRoom = function(room_id) {
	$("#main").hide();
	$("#roomMain").show();
	$("#roomFrame").attr("src", "room/#" + room_id);
};

/**
 * Is called by the room frame content when it wants to close the room.
 */
Lobby.prototype.leaveRoom = function() {
	$("#roomFrame").attr("src", "about:blank");
	$("#main").show();
	$("#roomMain").hide();
};

/**
 * Changes the name of a room.
 * 
 * @param room_id
 *            ID of the room
 * @param room_name
 *            The new name
 */
Lobby.prototype.onRoomChangeName = function(room_id, room_name) {
	console.log("onRoomChangeName: " + room_id + " " + room_name);

	var index = this.findRoomIndex(room_id);
	if (index != -1) {
		this.rooms[index][1] = room_name;
		$("#room_list_" + room_id + " h3").text(room_name);
	}
};

/**
 * Adds a room to the page if the ID doesn't exist. Should be called when a new
 * room is available on the server.
 * 
 * @param room_id
 *            ID of the added room
 * @param room_name
 *            Name of the added room
 * @param room_desc
 *            The description of the room
 * @param room_type
 *            Type of the room
 */
Lobby.prototype.onRoomAdd = function(room_id, room_name, room_desc, room_type) {
	console.log("onRoomAdd: " + room_id + " " + room_name + " " + room_desc
			+ " " + room_type);

	// Unique ids
	if ($("#room_list_" + room_id).length != 0) {
		return;
	}

	$("#room_table tfoot").hide();

	// Add to list
	this.rooms.push([ room_id, room_name, room_desc, room_type ]);
	$("#room_table tbody").append($("<tr/>", {
		id : "room_list_" + room_id,
		click : function() {
			this.onRoomClick(room_id);
		}
	}).append($("<td/>").append($("<h3/>", {
		text : room_name
	})).append(room_desc)).append($("<td/>", {
		id : "room_user_list_" + room_id
	})));
};

/**
 * Deletes a room from the page. Should be called when a room is deleted on the
 * server.
 * 
 * @param room_id
 *            ID of the deleted room
 */
Lobby.prototype.onRoomDelete = function(room_id) {
	console.log("onRoomDelete: " + room_id);

	// Find room with given id
	var index = this.findRoomIndex(room_id);
	if (index != -1) {
		// Remove from list
		this.rooms.splice(index, 1);
		$("#room_list_" + room_id).remove();

		if (this.rooms.length == 0) {
			$("#room_table tfoot").show();
		}
	}
};

/**
 * Called when a room is clicked.
 * 
 * @param room_id
 *            ID of the room
 */
Lobby.prototype.onRoomClick = function(room_id) {
	console.log("onRoomClick: " + room_id);

	var index = this.findRoomIndex(room_id);
	if (index != -1) {
		console.log("RoomClick found: " + this.rooms[index][0]);
		this.enterRoom(room_id);
	}
};

Lobby.prototype.onRemoteUserEnterRoom = function(remote_user_id, room_id) {
	console.log("onRemoteUserEnterRoom: " + remote_user_id + " " + room_id);

	var index = this.findRoomIndex(room_id);
	if (index != -1) {
		var user_index = this.findRemoteUserIndex(remote_user_id);
		if (user_index != -1) {
			this.remote_users[user_index][2] = room_id;

			// Make sure each user only exist in one room in the list
			$(".remote_user_" + this.remote_users[user_index][0]).remove();

			$("#room_user_list_" + room_id).append($("<span/>", {
				class : "remote_user_" + this.remote_users[user_index][0],
				text : this.remote_users[user_index][1] + " "
			}));
		}
	}
};

Lobby.prototype.onRemoteUserLeaveRoom = function(remote_user_id) {
	console.log("onRemoteUserLeaveRoom: " + remote_user_id);

	var user_index = this.findRemoteUserIndex(remote_user_id);
	if (user_index != -1) {
		this.remote_users[user_index][2] = 0;

		// Remove the user from the list
		$(".remote_user_" + this.remote_users[user_index][0]).remove();
	}
};

/**
 * Changes the name of a remote user.
 * 
 * @param remote_user_id
 *            Users ID
 * @param remote_user_name
 *            The new name
 */
Lobby.prototype.onRemoteUserChangeName = function(remote_user_id,
		remote_user_name) {
	console.log("onRemoteUserChangeName: " + remote_user_id + " "
			+ remote_user_name);

	var index = this.findRemoteUserIndex(remote_user_id);
	if (index != -1) {
		this.remote_users[index][1] = remote_user_name;
		$("span.remote_user_" + remote_user_id).text(remote_user_name + " ");
	}
};

/**
 * Adds a remote user to the list. Should be called when a user enters the
 * server.
 * 
 * @param remote_user_id
 *            ID of the remote user that entered
 * @param remote_user_name
 *            Name of the remote user that entered
 * @param room_id
 *            ID of the room which contains the user
 */
Lobby.prototype.onRemoteUserEnter = function(remote_user_id, remote_user_name,
		room_id) {
	console.log("onRemoteUserEnter: " + remote_user_id + " " + remote_user_name
			+ " " + room_id);

	// Add to list
	this.remote_users.push([ remote_user_id, remote_user_name, room_id ]);

	this.onRemoteUserEnterRoom(remote_user_id, room_id);
};

/**
 * Removes a remote user from the list. Should be called when a user leaves the
 * server.
 * 
 * @param remote_user_id
 *            ID of the remote user that left
 */
Lobby.prototype.onRemoteUserLeave = function(remote_user_id) {
	console.log("onRemoteUserLeave: " + remote_user_id);

	// Find remote_user with given id
	var index = this.findRemoteUserIndex(remote_user_id);
	if (index != -1) {
		// Remove from list
		this.remote_users.splice(index, 1);
		$(".remote_user_" + remote_user_id).remove();
	}
};

/**
 * Notifies the user that there is an incoming call. A call is auto-declined
 * after a specified time. Should be called when the user has been invited to a
 * room.
 * 
 * @param remote_user_name
 *            Name of the inviter
 * @param room_name
 *            Name of the room
 * @param call_id
 *            ID of the call
 */
Lobby.prototype.onIncomingCall = function(remote_user_name, room_name, call_id) {
	console.log("IncomingCall: " + remote_user_name + " " + room_name + " "
			+ call_id);

	// Unique ids
	if ($("#call_" + call_id).length != 0) {
		return;
	}

	var self = this;

	// Insert above
	$("<div/>", {
		id : "call_" + call_id,
		text : remote_user_name + " invited you to " + room_name + "."
	}).append($("<button/>", {
		text : "Accept",
		click : function() {
			self.accept(call_id);
		}
	}).button()).append($("<button/>", {
		text : "Decline",
		click : function() {
			self.decline(call_id);
		}
	}).button()).append($("<div/>", {
		id : "call_timer_" + call_id
	}).css({
		display : "inline",
		color : "red"
	})).hide().prependTo("#call_list");

	// Effect
	$("#call_" + call_id).show("drop");

	// Auto-decline after x seconds
	this.onAutoDeclineTimer(call_id, this.auto_decline_time);
};

/**
 * Removes the notification and accepts the call. Called when the user clicked
 * accept.
 * 
 * @param call_id
 *            ID of the call that was accepted
 */
Lobby.prototype.accept = function(call_id) {
	console.log("Accept: " + call_id);

	if ($("#call_" + call_id).length != 0) { // Extra check
		$("#call_timer_" + call_id).text("");
		// TODO Accept
		this.onCallAccepted("random_text");
		$("#call_" + call_id).removeAttr("id").hide({
			effect : "drop",
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
 * @param room_id
 */
Lobby.prototype.onCallAccepted = function(room_id) {
	this.enterRoom(room_id);
};

/**
 * Removes the notification and declines the call. Called when the user clicked
 * decline or when the timeout expired.
 * 
 * @param call_id
 *            ID of the call that was declined
 */
Lobby.prototype.decline = function(call_id) {
	console.log("Decline: " + call_id);

	if ($("#call_" + call_id).length != 0) { // Extra check
		$("#call_timer_" + call_id).text("");
		// TODO Decline
		$("#call_" + call_id).removeAttr("id").hide({
			effect : "drop",
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
 * @param call_id
 *            ID of the call
 * @param time_left
 *            Number of seconds left on the timeout
 */
Lobby.prototype.onAutoDeclineTimer = function(call_id, time_left) {
	if ($("#call_timer_" + call_id).length != 0) {
		// Might have been manually declined
		new_time_left = time_left - 1;
		if (new_time_left <= 0) { // Time is up, decline
			this.decline(call_id);
		} else {
			if (new_time_left <= 10) { // Only display last 10 seconds
				$("#call_timer_" + call_id).text(new_time_left);
			}

			var self = this;
			setTimeout(function() {
				self.onAutoDeclineTimer(call_id, new_time_left);
			}, 1000);
		}
	}
};

function assert(exp, message) {
	if (!exp) {
		console.error(message);
	}
}

Lobby.prototype.test = function() {
	console.log("Running test...");

	this.onLobbyLoad([ [ 1, "Test Room", "", 0 ],
			[ 2, "Room 2", "Some desc", 0 ] ], [ [ 1, "Karl", 1 ],
			[ 2, "Jonas", 1 ] ]);

	this.changeUserName("Test name");

	this.onIncomingCall("Kalle", "Room test", 1);

	// Test rooms
	assert(this.findRoomIndex(1) == 0, "Room index of 1 is wrong");
	assert(this.rooms[0][1] == "Test Room", "Room has wrong name");
	assert(this.rooms[1][2] == "Some desc", "Room has wrong desc");
	assert(this.rooms[0][3] == 0, "Room has wrong type");
	this.onRoomAdd(3, "Room 3", "Desc", 1);
	this.onRoomChangeName(1, "New name");
	assert(this.rooms[0][1] == "New name", "Room has wrong name after change");
	this.onRoomAdd(4, "Delete me", "Desc", 1);
	this.onRoomDelete(4);
	assert(this.rooms.length == 3, "Room wasnt removed");

	// Test users
	assert(this.findRemoteUserIndex(1) == 0, "User index of 1 is wrong");
	assert(this.remote_users[0][1] == "Karl", "User has wrong name");
	assert(this.remote_users[0][2] == 1, "User has wrong room_id");
	this.onRemoteUserEnter(3, "User 3", 2);
	this.onRemoteUserLeave(3);
	assert(this.remote_users.length == 2, "User wasnt removed");
	this.onRemoteUserEnter(4, "User 4", 3);
	this.onRemoteUserChangeName(4, "New user 4");
	assert(this.remote_users[this.findRemoteUserIndex(4)][1] == "New user 4",
			"User has wrong name after change");
	this.onRemoteUserEnterRoom(4, 1);
	this.onRemoteUserLeaveRoom(4);
	assert(this.remote_users[this.findRemoteUserIndex(4)][2] == 0,
			"User didnt leave room");
};
