var auto_decline_time = 60;
var rooms = []; // [name, id, [user_ids]]
var remote_users = []; // [name, id]
var user_name = "User#" + Math.floor((Math.random() * 999) + 1);

$(function() {
	$("#display_user_name").text(user_name);

	$("#create_room, #change_user_name").button();
	$("#create_room").click(function() {
		$("#dialog_create_room").dialog("open");
	});
	$("#change_user_name").click(function() {
		$("#dialog_select_user_name").dialog("open");
	});

	$("#dialog_select_user_name").dialog({
		autoOpen : false,
		modal : true,
		open : function(event, ui) {
			$("#user_name").val(user_name);
			$("#user_name").removeClass("ui-state-error");
		},
		buttons : {
			OK : function() {
				var name = $("#user_name").val();
				if (name == "") {
					$("#user_name").addClass("ui-state-error");
				} else {
					onChangeUserName(name);
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
		open : function(event, ui) {
			$("#room_name").removeClass("ui-state-error");
		},
		buttons : {
			OK : function() {
				var name = $("#room_name").val();
				if (name == "") {
					$("#room_name").addClass("ui-state-error");
				} else {
					onCreateRoom(name);
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

	onLobbyLoad([ [ "Test Room", 1, [] ], [ "Room 2", 2, [ 1, 2 ] ] ], [
			[ "Karl", 1 ], [ "Jonas", 2 ] ]);
});

/**
 * Searches for and returns the index if found, -1 otherwise.
 * 
 * @param room_id
 *            The ID to look for
 * @returns {Number}
 */
function findRoomIndex(room_id) {
	// Find room with given id
	for ( var i = 0; i < rooms.length; i++) {
		if (rooms[i][1] === room_id) {
			return i;
		}
	}
	return -1;
}

/**
 * Searches for and returns the index if found, -1 otherwise.
 * 
 * @param remote_user_id
 *            The ID to look for
 * @returns {Number}
 */
function findRemoteUserIndex(remote_user_id) {
	// Find remote_user with given id
	for ( var i = 0; i < remote_users.length; i++) {
		if (remote_users[i][1] === remote_user_id) {
			return i;
		}
	}
	return -1;
}

/**
 * Changes the user name to a new name if it isn't the empty string. Called when
 * the user clicks OK in the select user name dialog.
 * 
 * @param new_name
 *            The new user name
 */
function onChangeUserName(new_name) {
	console.log("ChangeUserName: " + new_name);

	if (new_name != "") {
		user_name = new_name;
	}
	$("#display_user_name").text(user_name);
}

/**
 * Adds all rooms and remote users to the page. Should be called when the page
 * is loaded.
 * 
 * @param rooms
 *            A list of pairs [room_name, room_id]
 * @param remote_users
 *            A list of pairs [remote_user_name, remote_user_id]
 */
function onLobbyLoad(rooms, remote_users) {
	console.log("Load");

	// Add users
	for ( var i = 0; i < remote_users.length; i++) {
		onRemoteUserEnter(remote_users[i][0], remote_users[i][1]);
	}

	// Add rooms
	for ( var i = 0; i < rooms.length; i++) {
		onRoomAdd(rooms[i][0], rooms[i][1], rooms[i][2]);
	}
}

/**
 * Lets the user select a room name. The room is then created. Called when the
 * create room button is clicked.
 * 
 * @param room_name
 *            Name of the new room
 */
function onCreateRoom(room_name) {
	console.log("CreateRoom: " + room_name);

	if (room_name != "") {
		// TODO Create room
		onRoomCreated("random_text");
	}
}

/**
 * Callback function for when the room has been created. The user will be
 * redirected to the new room.
 * 
 * @param room_id
 *            ID of the room created.
 */
function onRoomCreated(room_id) {
	enterRoom(room_id);
}

/**
 * Redirects the user to a room with a given id.
 * 
 * @param room_id
 *            ID of the room
 */
function enterRoom(room_id) {
	document.location += "room/#" + room_id;
}

/**
 * Changes the name of a room.
 * 
 * @param room_name
 *            The new name
 * @param room_id
 *            ID of the room
 */
function onRoomChangeName(room_name, room_id) {
	console.log("RoomChangeName: " + room_name + " " + room_id);

	var index = findRoomIndex(room_id);
	if (index != -1) {
		rooms[index][0] = room_name;
		$("#room_list_" + room_id + " a").text(room_name);
	}
}

/**
 * Adds a room to the page if the ID doesn't exist. Should be called when a new
 * room is available on the server.
 * 
 * @param room_name
 *            Name of the added room
 * @param room_id
 *            ID of the added room
 * @param remote_user_ids
 *            A list of user IDs in the room
 */
function onRoomAdd(room_name, room_id, remote_user_ids) {
	console.log("RoomAdd: " + room_name + " " + room_id);

	// Unique ids
	if ($("#room_list_" + room_id).length != 0) {
		return;
	}

	// Add to list
	rooms.push([ room_name, room_id, remote_user_ids ]);
	$("<a/>", {
		href : "#",
		text : room_name,
		click : function(event) {
			event.preventDefault();
			onRoomClick(room_id);
		}
	}).prependTo($("<div/>", {
		id : "room_list_" + room_id
	}).css({
		padding : "5px"
	}).append($("<div/>", {
		id : "room_user_list_" + room_id
	})).appendTo("#room_list"));

	updateRoomUserList(room_id);
}

/**
 * Clears and sets new content to the user list for the room.
 * 
 * @param room_id
 *            ID of the room
 */
function updateRoomUserList(room_id) {
	console.log("UpdateRoomUserList: " + room_id);

	var index = findRoomIndex(room_id);
	if (index != -1) {
		$("#room_user_list_" + room_id).empty();

		// Loop over user ids
		$("#room_user_list_" + room_id).text("Users: ");
		for ( var i = 0; i < rooms[index][2].length; i++) {
			var user_index = findRemoteUserIndex(rooms[index][2][i]);
			if (user_index != -1) {
				// Make sure each user only exist in one room in the list
				$("i.remote_user_" + remote_users[user_index][1]).remove();

				$("#room_user_list_" + room_id).append($("<i/>", {
					class : "remote_user_" + remote_users[user_index][1],
					text : remote_users[user_index][0] + " "
				}));
			}
		}
	}
}

/**
 * Delets a room from the page. Should be called when a room is deleted on the
 * server.
 * 
 * @param room_id
 *            ID of the deleted room
 */
function onRoomDelete(room_id) {
	console.log("RoomDelete: " + room_id);

	// Find room with given id
	var index = findRoomIndex(room_id);
	if (index != -1) {
		// Remove from list
		rooms.splice(index, 1);
		$("#room_list_" + room_id).remove();
	}
}

/**
 * Called when a room is clicked.
 * 
 * @param room_id
 *            ID of the room
 */
function onRoomClick(room_id) {
	console.log("RoomClick: " + room_id);

	var index = findRoomIndex(room_id);
	if (index != -1) {
		console.log("RoomClick found: " + rooms[index][0]);
		enterRoom(room_id);
	}
}

function onRemoteUserEnterRoom(remote_user_id, room_id) {
	console.log("RemoteUserEnterRoom: " + remote_user_id + " " + room_id);

	// TODO Check if the user id is in another room?
	var index = findRoomIndex(room_id);
	if (index != -1) {
		var user_index = findRemoteUserIndex(remote_user_id);
		if (user_index != -1) {
			if (rooms[index][2].indexOf(remote_user_id) == -1) {
				rooms[index][2].push(remote_user_id);

				// Make sure each user only exist in one room in the list
				$("i.remote_user_" + remote_users[user_index][1]).remove();

				$("#room_user_list_" + room_id).append($("<i/>", {
					class : "remote_user_" + remote_users[user_index][1],
					text : remote_users[user_index][0] + " "
				}));
			}
		}
	}
}

function onRemoteUserLeaveRoom(remote_user_id, room_id) {
	console.log("RemoteUserLeaveRoom: " + remote_user_id + " " + room_id);

	var index = findRoomIndex(room_id);
	if (index != -1) {
		var user_index = findRemoteUserIndex(remote_user_id);
		if (user_index != -1) {
			var old_index = rooms[index][2].indexOf(remote_user_id);
			if (old_index != -1) {
				rooms[index][2].splice(old_index, 1);

				// Remove the user from the list
				$("i.remote_user_" + remote_users[user_index][1]).remove();
			}
		}
	}
}

/**
 * Changes the name of a remote user.
 * 
 * @param remote_user_name
 *            The new name
 * @param remote_user_id
 *            Users ID
 */
function onRemoteUserChangeName(remote_user_name, remote_user_id) {
	console.log("RemoteUserChangeName: " + remote_user_name + " "
			+ remote_user_id);

	var index = findRemoteUserIndex(remote_user_id);
	if (index != -1) {
		remote_users[index][0] = remote_user_name;
		$("i.remote_user_" + remote_user_id).text(remote_user_name + " ");
		$("button.remote_user_" + remote_user_id).children().first().text(
				remote_user_name);
	}
}

/**
 * Adds a remote user to the list. Should be called when a user enters the
 * server.
 * 
 * @param remote_user_name
 *            Name of the remote user that entered
 * @param remote_user_id
 *            ID of the remote user that entered
 */
function onRemoteUserEnter(remote_user_name, remote_user_id) {
	console.log("RemoteUserEnter: " + remote_user_name + " " + remote_user_id);

	// Unique ids
	if ($("#remote_user_list_" + remote_user_id).length != 0) {
		return;
	}

	// Add to list
	remote_users.push([ remote_user_name, remote_user_id ]);
	$("<button/>", {
		text : remote_user_name,
		class : "remote_user_" + remote_user_id,
		click : function() {
			onRemoteUserClick(remote_user_id);
		}
	}).button().appendTo("#remote_user_list");
}

/**
 * Removes a remote user from the list. Should be called when a user leaves the
 * server.
 * 
 * @param remote_user_id
 *            ID of the remote user that left
 */
function onRemoteUserLeave(remote_user_id) {
	console.log("RemoteUserLeave: " + remote_user_id);

	// Find remote_user with given id
	var index = findRemoteUserIndex(remote_user_id);
	if (index != -1) {
		// Remove from list
		remote_users.splice(index, 1);
		$(".remote_user_" + remote_user_id).remove();
	}
}

/**
 * Called when a remote user is clicked.
 * 
 * @param remote_user_id
 *            ID of the remote user
 */
function onRemoteUserClick(remote_user_id) {
	console.log("RemoteUserClick: " + remote_user_id);

	// TODO
	var index = findRemoteUserIndex(remote_user_id);
	if (index != -1) {
		console.log("RemoteUserClick found: " + remote_users[index][0]);
	}
}

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
function onIncomingCall(remote_user_name, room_name, call_id) {
	console.log("IncomingCall: " + remote_user_name + " " + room_name + " "
			+ call_id);

	// Unique ids
	if ($("#call_" + call_id).length != 0) {
		return;
	}

	// Insert above
	$("<div/>", {
		id : "call_" + call_id,
		text : remote_user_name + " wants you to join " + room_name + "."
	}).append($("<button/>", {
		text : "Accept",
		click : function() {
			accept(call_id);
		}
	}).button()).append($("<button/>", {
		text : "Decline",
		click : function() {
			decline(call_id);
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
	onAutoDeclineTimer(call_id, auto_decline_time);
}

/**
 * Removes the notification and accepts the call. Called when the user clicked
 * accept.
 * 
 * @param call_id
 *            ID of the call that was accepted
 */
function accept(call_id) {
	console.log("Accept: " + call_id);

	if ($("#call_" + call_id).length != 0) { // Extra check
		$("#call_timer_" + call_id).text("");
		// TODO Accept
		onCallAccepted("random_text");
		$("#call_" + call_id).removeAttr("id").hide({
			effect : "drop",
			complete : function() {
				$(this).remove();
			}
		});
	}
}

/**
 * Callback function for when the call has been accepted. The user will be
 * redirected to the room.
 * 
 * @param room_id
 */
function onCallAccepted(room_id) {
	enterRoom(room_id);
}

/**
 * Removes the notification and declines the call. Called when the user clicked
 * decline or when the timeout expired.
 * 
 * @param call_id
 *            ID of the call that was declined
 */
function decline(call_id) {
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
}

/**
 * Counts down the auto-decline timeout by one second. A counter is displayed
 * when there its less or equal to 10 seconds remaining.
 * 
 * @param call_id
 *            ID of the call
 * @param time_left
 *            Number of seconds left on the timeout
 */
function onAutoDeclineTimer(call_id, time_left) {
	if ($("#call_timer_" + call_id).length != 0) {
		// Might have been manually declined
		time_left--;
		if (time_left <= 0) { // Time is up, decline
			decline(call_id);
		} else {
			if (time_left <= 10) { // Only display last 10 seconds
				$("#call_timer_" + call_id).text(time_left);
			}

			setTimeout(function() {
				onAutoDeclineTimer(call_id, time_left);
			}, 1000);
		}
	}
}
