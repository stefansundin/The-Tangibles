var auto_decline_time = 60;
var rooms = []; // [id, name, desc, type]
var remote_users = []; // [id, name, room_id]
var user_name = "User#" + Math.floor((Math.random() * 999) + 1);

var socket = new ClientSocket("ws://130.240.5.191:12345");

var API_USER_ENTER = "userenter";
var API_USER_LEAVE = "userleave";
var API_ROOM_ENTER = "roomenter";
var API_ROOM_LEAVE = "roomleave";

var API_LIST_ROOMS = "listrooms";
var API_LIST_USERS = "listusers";
var API_LIST = "listall";

var API_USER_NEW = "useradd";
var API_USER_REMOVE = "userremove";
var API_ROOM_NEW = "roomadd";
var API_ROOM_REMOVE = "roomremove";

var API_INVITE_SEND = "invitesend";
var API_INVITE_ANSWER = "inviteanswer";
var API_INVIE_TIMEOUT = "invitetimeout";

var API_MESSAGE = "message";

var API_CORNERS = "corners";

var API_SET_NAME = "setname";

$(function() {
  
	// Set up socket handlers
	socket.on("open", onSocketOpen);
	socket.on("close", onSocketClose);
	socket.on(API_SET_NAME, function(user_name) {
		$("#display_user_name").text(user_name);
	});
	socket.on(API_LIST, onLobbyLoad);

	$("#room_table tfoot").hide();

	$("#display_user_name").text(user_name);

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
			$("#user_name").val(user_name);
			$("#user_name").removeClass("ui-state-error");
		},
		buttons : {
			OK : function() {
				var name = $("#user_name").val();
				if (name == "") {
					$("#user_name").addClass("ui-state-error");
				} else {
					changeUserName(name);
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
});

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

/**
 * Called when the socket connection is opened.
 */
function onSocketOpen() {
	console.log("onOpen");

	// request stuff
	changeUserName(user_name);
	socket.send(API_LIST, "");
}

/**
 * Called when the socket connection is closed.
 */
function onSocketClose() {
	console.log("onClose");

	showError("Lost server connection...");
}

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
		if (rooms[i][0] === room_id) {
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
		if (remote_users[i][0] === remote_user_id) {
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
function changeUserName(new_name) {
	console.log("onChangeUserName: " + new_name);

	if (new_name != "") {
		user_name = new_name;
		$("#display_user_name").text(user_name);

		socket.send(API_SET_NAME, JSON.stringify({
			name : user_name
		}));
	}
}

/**
 * Adds all rooms and remote users to the page. Should be called when the page
 * is loaded.
 * 
 * @param rooms
 *            A list of rooms
 * @param remote_users
 *            A list of users
 */
function onLobbyLoad(rooms, remote_users) {
	console.log("onLobbyLoad: " + rooms + " " + remote_users);

	this.rooms = [];
	this.remote_users = [];

	$("#room_table tbody").empty();
	$("#room_table tfoot").show();

	// Add rooms
	for ( var i = 0; i < rooms.length; i++) {
		onRoomAdd(rooms[i][0], rooms[i][1], rooms[i][2], rooms[i][3]);
	}

	// Add users
	for ( var i = 0; i < remote_users.length; i++) {
		onRemoteUserEnter(remote_users[i][0], remote_users[i][1],
				remote_users[i][2]);
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
	console.log("onCreateRoom: " + room_name);

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
	//document.location += "room/#" + room_id;
  document.getElementById("main").style.display = "none";
  document.getElementById("roomMain").style.display = "block";
  //var loc = document.location += "room/#" + room_id;
  document.getElementById("roomFrame").src="http://localhost:8000/room/#" + room_id;
}

/**
 * Is called by the room frame content when it wants to close the room.
*/
function leaveRoom() {
  document.getElementById("roomFrame").src = "about:blank";
  document.getElementById("main").style.display = "block";
  document.getElementById("roomMain").style.display = "none";
}

/**
 * Changes the name of a room.
 * 
 * @param room_id
 *            ID of the room
 * @param room_name
 *            The new name
 */
function onRoomChangeName(room_id, room_name) {
	console.log("onRoomChangeName: " + room_id + " " + room_name);

	var index = findRoomIndex(room_id);
	if (index != -1) {
		rooms[index][1] = room_name;
		$("#room_list_" + room_id + " h3").text(room_name);
	}
}

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
function onRoomAdd(room_id, room_name, room_desc, room_type) {
	console.log("onRoomAdd: " + room_id + " " + room_name + " " + room_desc
			+ " " + room_type);

	// Unique ids
	if ($("#room_list_" + room_id).length != 0) {
		return;
	}

	$("#room_table tfoot").hide();

	// Add to list
	rooms.push([ room_id, room_name, room_desc, room_type ]);
	$("#room_table tbody").append($("<tr/>", {
		id : "room_list_" + room_id,
		click : function() {
			onRoomClick(room_id);
		}
	}).append($("<td/>").append($("<h3/>", {
		text : room_name
	})).append(room_desc)).append($("<td/>", {
		id : "room_user_list_" + room_id
	})));
}

/**
 * Delets a room from the page. Should be called when a room is deleted on the
 * server.
 * 
 * @param room_id
 *            ID of the deleted room
 */
function onRoomDelete(room_id) {
	console.log("onRoomDelete: " + room_id);

	// Find room with given id
	var index = findRoomIndex(room_id);
	if (index != -1) {
		// Remove from list
		rooms.splice(index, 1);
		$("#room_list_" + room_id).remove();

		if (rooms.length == 0) {
			$("#room_table tfoot").show();
		}
	}
}

/**
 * Called when a room is clicked.
 * 
 * @param room_id
 *            ID of the room
 */
function onRoomClick(room_id) {
	console.log("onRoomClick: " + room_id);

	var index = findRoomIndex(room_id);
	if (index != -1) {
		console.log("RoomClick found: " + rooms[index][0]);
		enterRoom(room_id);
	}
}

function onRemoteUserEnterRoom(remote_user_id, room_id) {
	console.log("onRemoteUserEnterRoom: " + remote_user_id + " " + room_id);

	var index = findRoomIndex(room_id);
	if (index != -1) {
		var user_index = findRemoteUserIndex(remote_user_id);
		if (user_index != -1) {
			remote_users[user_index][2] = room_id;

			// Make sure each user only exist in one room in the list
			$(".remote_user_" + remote_users[user_index][0]).remove();

			$("#room_user_list_" + room_id).append($("<span/>", {
				class : "remote_user_" + remote_users[user_index][0],
				text : remote_users[user_index][1] + " "
			}));
		}
	}
}

function onRemoteUserLeaveRoom(remote_user_id) {
	console.log("onRemoteUserLeaveRoom: " + remote_user_id);

	var user_index = findRemoteUserIndex(remote_user_id);
	if (user_index != -1) {
		remote_users[user_index][2] = 0;

		// Remove the user from the list
		$(".remote_user_" + remote_users[user_index][0]).remove();
	}
}

/**
 * Changes the name of a remote user.
 * 
 * @param remote_user_id
 *            Users ID
 * @param remote_user_name
 *            The new name
 */
function onRemoteUserChangeName(remote_user_id, remote_user_name) {
	console.log("onRemoteUserChangeName: " + remote_user_id + " "
			+ remote_user_name);

	var index = findRemoteUserIndex(remote_user_id);
	if (index != -1) {
		remote_users[index][1] = remote_user_name;
		$("span.remote_user_" + remote_user_id).text(remote_user_name + " ");
	}
}

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
function onRemoteUserEnter(remote_user_id, remote_user_name, room_id) {
	console.log("onRemoteUserEnter: " + remote_user_id + " " + remote_user_name
			+ " " + room_id);

	// Add to list
	remote_users.push([ remote_user_id, remote_user_name, room_id ]);

	onRemoteUserEnterRoom(remote_user_id, room_id);
}

/**
 * Removes a remote user from the list. Should be called when a user leaves the
 * server.
 * 
 * @param remote_user_id
 *            ID of the remote user that left
 */
function onRemoteUserLeave(remote_user_id) {
	console.log("onRemoteUserLeave: " + remote_user_id);

	// Find remote_user with given id
	var index = findRemoteUserIndex(remote_user_id);
	if (index != -1) {
		// Remove from list
		remote_users.splice(index, 1);
		$(".remote_user_" + remote_user_id).remove();
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
		text : remote_user_name + " invited you to " + room_name + "."
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

function assert(exp, message) {
	if (!exp) {
		console.error(message);
	}
}

function testLobby() {
	console.log("Running test...");

	onLobbyLoad([ [ 1, "Test Room", "", 0 ], [ 2, "Room 2", "Some desc", 0 ] ],
			[ [ 1, "Karl", 1 ], [ 2, "Jonas", 1 ] ]);

	changeUserName("Test name");

	onIncomingCall("Kalle", "Room test", 1);

	// Test rooms
	assert(findRoomIndex(1) == 0, "Room index of 1 is wrong");
	assert(rooms[0][1] == "Test Room", "Room has wrong name");
	assert(rooms[1][2] == "Some desc", "Room has wrong desc");
	assert(rooms[0][3] == 0, "Room has wrong type");
	onRoomAdd(3, "Room 3", "Desc", 1);
	onRoomChangeName(1, "New name");
	assert(rooms[0][1] == "New name", "Room has wrong name after change");
	onRoomAdd(4, "Delete me", "Desc", 1);
	onRoomDelete(4);
	assert(rooms.length == 3, "Room wasnt removed");

	// Test users
	assert(findRemoteUserIndex(1) == 0, "User index of 1 is wrong");
	assert(remote_users[0][1] == "Karl", "User has wrong name");
	assert(remote_users[0][2] == 1, "User has wrong room_id");
	onRemoteUserEnter(3, "User 3", 2);
	onRemoteUserLeave(3);
	assert(remote_users.length == 2, "User wasnt removed");
	onRemoteUserEnter(4, "User 4", 3);
	onRemoteUserChangeName(4, "New user 4");
	assert(remote_users[findRemoteUserIndex(4)][1] == "New user 4",
			"User has wrong name after change");
	onRemoteUserEnterRoom(4, 1);
	onRemoteUserLeaveRoom(4);
	assert(remote_users[findRemoteUserIndex(4)][2] == 0,
			"User didnt leave room");
}
