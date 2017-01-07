var results;
var app = {
  server: 'http://ec2-52-78-46-241.ap-northeast-2.compute.amazonaws.com:4000',
  check: {},
	lastObjectID : 0,
	NickFlag : true
};
app.init = function() {
	$('#roomSelect').css({backgroundColor : 'white'});

  $('.username').click(function() {
    app.handleUsernameClick();
  });

  $('#send .submit').click(function() {
		var NickFlag = true;
		var RoomFlag = true;


    var message = {
      username: $('#nickname').val(),
      text: $('#message').val(),
      roomname: $("#roomSelect option:selected").val()
    };
		if($('#nickname').val() === ''){
			$('#nickname').css({backgroundColor : '#D0D0D0'});
			app.NickFlag = false;
		}
		else{
			$('#nickname').css({backgroundColor : 'white'});
			app.NickFlag = true;
		}


		if($("#roomSelect option:selected").val() === 'None'){
			$('#roomSelect').css({backgroundColor : '#D0D0D0'});
			RoomFlag = false;
		}
		if(app.NickFlag && RoomFlag){
			app.handleSubmit(message);
		}
  });

  $("#roomSelect").change(function() {
		$('#roomSelect').css({backgroundColor : 'white'});
    var DropDownValue = $(this).val();
    if (DropDownValue === 'newroom') {
      var OtherData = prompt("Enter Other Rooms!");
      app.renderRoom(OtherData);
			app.check[OtherData] = true;
    } else {
      app.clearMessages();
			app.lastObjectID = 0;
      console.log("fetchForSelected");
    }
  });

	setInterval(function(){
		if($('#nickname').val().length !== 0 && !app.NickFlag)	{
			$('#nickname').css({backgroundColor : 'white'});
			app.NickFlag = true;
		}
		app.fetch();
	},300);



};
app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the AWS server.
    url: 'http://ec2-52-78-46-241.ap-northeast-2.compute.amazonaws.com:4000',
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
    url: 'http://ec2-52-78-46-241.ap-northeast-2.compute.amazonaws.com:4000',
    type: 'GET',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      var results = data.results;
      var len = results.length;

      for (var i = app.lastObjectID; i < results.length; i++) {
        if (app.check[results[i].roomname] !== true) {
          app.check[results[i].roomname] = true;
          app.renderRoom(results[i].roomname);
        }
      }
      for (var j = app.lastObjectID; j < len; j++) {
        console.log($("#roomSelect option:selected").val());
        if (results[j].roomname === $("#roomSelect option:selected").val()) {
          app.renderMessage(results[j]);
        } else if ($("#roomSelect option:selected").val() === 'None') {
          app.renderMessage(results[j]);
        }
      }
			app.lastObjectID = len;

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

  $('#chats').prepend('<div class="msg">' + '<div class="username"><h3 class=icon-user>' + message.username + '</h3></div>' + '<div class="text">' + message.text + '</div>' +  '</div><br>');
};
app.renderRoom = function(roomname) {
  $('#roomSelect').append('<option id=' + roomname + ' value=' + roomname + '>' + roomname + '</option>');
};

app.handleUsernameClick = function() {

};
app.handleSubmit = function(message) {
  app.send(message);
};


app.init();
