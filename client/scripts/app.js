var app = {
	server: 'http://127.0.0.1:4000',
	check: {},
	lastObjectID: 0,
	IsNickWhite: true,
};

app.isEmptyNickname = function() {
	var isEmpty = $('#nickname').val() === '';
	return isEmpty;
};

app.changeBackgroundColorToGray = function(ID) {
	ID.css({
		backgroundColor: '#D0D0D0'
	});
};

app.changeBackgroundColorToWhite = function(ID) {
	ID.css({
		backgroundColor: 'white'
	});
};

app.IsSelectNone = function() {
	return $("#roomSelect option:selected").val() === 'None';
};

app.IsOkSubmitMessage = function(IsRoomWhite) {
	return app.IsNickWhite && IsRoomWhite;
};

app.MakeAnotherRoom = function(OtherData) {
	app.renderRoom(OtherData);
	app.check[OtherData] = true;
};
app.MakeUnduplicatedRoom = function(results) {
	var len = results.length;
	for (var i = app.lastObjectID; i < len; i++) {
		var dataRoomName = results[i].roomname;
		if (app.check[dataRoomName] !== true) {
			app.check[dataRoomName] = true;
			app.renderRoom(dataRoomName);
		}
	}
};

app.RenderMessageInSelectedRoom = function(results) {
	var len = results.length;
	for (var j = app.lastObjectID; j < len; j++) {
		var dataRoomName = results[j].roomname;
		var nowSelectedRoomName = $("#roomSelect option:selected").val();
		var IsSameRoomName = dataRoomName === nowSelectedRoomName;
		var IsNoneRoomName = 'None' === nowSelectedRoomName;
		if (IsSameRoomName || IsNoneRoomName) app.renderMessage(results[j]);
	}
};
app.init = function() {
	$('#roomSelect').css({
		backgroundColor: 'white'
	});

	$('.username').click(function() {
		app.handleUsernameClick();
	});

	$('#send .submit').click(function() {
		var IsRoomWhite = true;

		var message = {
			username: $('#nickname').val(),
			text: $('#message').val(),
			roomname: $("#roomSelect option:selected").val(),
		};
		if (app.isEmptyNickname()) {
			app.changeBackgroundColorToGray($('#nickname'));
			app.IsNickWhite = false
		} else {
			app.changeBackgroundColorToWhite($('#nickname'));
			app.IsNickWhite = true;
		}

		if (app.IsSelectNone()) {
			app.changeBackgroundColorToGray($('#roomSelect'));
			IsRoomWhite = false;
		}
		if (app.IsOkSubmitMessage(IsRoomWhite)) {
			app.handleSubmit(message);
		}

	});

	$("#roomSelect").change(function() {
		app.changeBackgroundColorToWhite($('#roomSelect'));

		var DropDownValue = $(this).val();
		if (DropDownValue === 'newroom') {
			var OtherData = prompt("Enter Other Rooms!");
			app.MakeAnotherRoom(OtherData);
		} else {
			app.clearMessages();
			app.lastObjectID = 0;
		}
	});

	setInterval(function() {
		var isNotEmptyNickname = $('#nickname').val().length !== 0 && !app.IsNickWhite;
		if (isNotEmptyNickname) {
			app.changeBackgroundColorToWhite($('#nickname'));
			app.IsNickWhite = true;
		}

	}, 1000);

	app.fetch();

};
app.send = function(message) {
	$('#message').val()='';
	$.ajax({
		// This is the url you should use to communicate with the AWS server.
		url: app.server,
		type: 'POST',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function(data) {
			console.log("post:", data);
			console.log('chatterbox: Message sent');
		},
		error: function(data) {
			// See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
			console.error('chatterbox: Failed to send message', data);
		}
	});
};

app.fetch = function() {
	$.ajax({
		// This is the url you should use to communicate with the AWS server.
		url: app.server,
		type: 'GET',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function(data) {
			var results = data.results;

			app.MakeUnduplicatedRoom(results);
			app.RenderMessageInSelectedRoom(results);
			app.lastObjectID = results.length;
			setTimeout(() => app.fetch(), 300)
			console.log('chatterbox: Message fetched');
		},
		error: function(data) {
			// See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
			console.error('chatterbox: Failed to send message', data);
		}
	});
};
app.clearMessages = function() {
	$('#chats').children().remove();
};
app.renderMessage = function(message) {

	$('#chats').prepend('<div class="msg">' + '<div class="username"><h3 class=icon-user>' + message.username + '</h3></div>' + '<div class="text">' + message.text + '</div>' + '</div><br>');
};
app.renderRoom = function(roomname) {
	$('#roomSelect').append('<option id=' + roomname + ' value=' + roomname + '>' + roomname + '</option>');
};

app.handleUsernameClick = function() {};
app.handleSubmit = function(message) {
	app.send(message);
};


app.init();
