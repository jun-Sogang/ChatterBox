var results;
var app = {
	server: 'http://ec2-52-78-46-241.ap-northeast-2.compute.amazonaws.com:4000'
};
app.init = function() {
	$('.username').click(function() {
		app.handleUsernameClick();
	});
	$('#send .submit').click(function() {

		var message = {
			username: 'name',
			text: $('#message').val(),
			roomname: 'room'
		};

		app.handleSubmit(message);
	});
	$("#roomSelect").change(function() {
		var DropDownValue = $(this).val();
		if (DropDownValue === 'newroom') {
			var OtherData = prompt("Enter Other Rooms!");
			app.renderRoom(OtherData);
		} else {
			app.fetch();
			console.log("here", results);
		}
	});
};
app.send = function(message) {
	$.ajax({
		// This is the url you should use to communicate with the AWS server.
		url: 'http://ec2-52-78-46-241.ap-northeast-2.compute.amazonaws.com:4000',
		type: 'POST',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function(data) {
			console.log("post", data);
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
		url: 'http://ec2-52-78-46-241.ap-northeast-2.compute.amazonaws.com:4000',
		type: 'GET',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function(data) {
			results = data.results;
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

	$('#chats').append('<div class="msg">' + '<div class="username">' + message.username + '</div>' + '<div class="text">' + message.text + '</div>' + '<div class="rooname">' + message.roomname + '</div>' + '</div>');
};
app.renderRoom = function(roomname) {
	$('#roomSelect').append('<option id=' + roomname + ' value=' + roomname + '>' + roomname + '</option>');
};

app.handleUsernameClick = function() {

};
app.handleSubmit = function(message) {
	app.send(message);
	app.renderMessage(message);
	app.fetch();
};

// app.post("http://ec2-52-78-46-241.ap-northeast-2.compute.amazonaws.com:4000/message", function(data){
//     alert("Data: " + data );
// });

app.init();


function triggerAjax(message, type) {
	$.ajax({
		// This is the url you should use to communicate with the AWS server.
		url: 'http://ec2-52-78-46-241.ap-northeast-2.compute.amazonaws.com:4000',
		type: type,
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function(data) {
			console.log('chatterbox: Message sent');
		},
		error: function(data) {
			// See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
			console.error('chatterbox: Failed to send message', data);
		}
	});

}
