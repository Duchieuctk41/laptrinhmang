var socket = io("http://localhost:3000");


socket.on("Server-send-username", function(data) {

  $('#listUser').append('<li class="user-main-container-inside" id="P-' + data + '"><div class="user-main-inside photo"><div class="user-main-image"><img src="./images/users.jpg"></div></div><div class="user-main-inside text"><div class="user-main-name"><p>' + data + '</p></div><div class="user-main-message"><div class="user-last-message message"><p id="last-mes-' + data.P + '">Last seen message</p></div><div class="user-last-message date"><p>Date</p></div></div></div></li>');
  // $('#listUser').append('<li class="user-main-container-inside" id="N-' + data + '"><div class="user-main-inside photo"><div class="user-main-image"><img src="./images/users.jpg"></div></div><div class="user-main-inside text"><div class="user-main-name"><p>' + data + '</p></div><div class="user-main-message"><div class="user-last-message message"><p id="last-mes-' + data.N + '">Last seen message</p></div><div class="user-last-message date"><p>Date</p></div></div></div></li>');
})
socket.on("Server-send-room", function (data) {
  $('#listUser').append('<li class="user-main-container-inside" id="N-' + data + '"><div class="user-main-inside photo"><div class="user-main-image"><img src="./images/users.jpg"></div></div><div class="user-main-inside text"><div class="user-main-name"><p>' + data + '</p></div><div class="user-main-message"><div class="user-last-message message"><p id="last-mes-' + data + '">Last seen message</p></div><div class="user-last-message date"><p>Date</p></div></div></div></li>');
})
/* dem so nguoi dang online*/
socket.on("server-send-people", function(i) {
    $('#peoples').html(i);
})
socket.on("server-send-people-leave", function(i) {
    $('#peoples').html(i);
})
/* bat su kien chat all*/
socket.on("server-send-Messages-all", function (data) {
  $('#last-mes-all').html(data.un);
});
socket.on("server-send-Messages-yourself", function(data) {
    $('#chat-container').append('<div class="chat-right"><div class="chat-right-page image"><div class="chat-display-image"><img src="./images/check.jfif"></div></div><div class="chat-right-page name"><div class="chat-display-name"><p>' + data.un + '</p></div></div></div>');
});

socket.on("server-send-Messages-friends", function(data) {
    $('#chat-container').append('<div class="chat-left"><div class="chat-left-page image"><div class="chat-left-display-image"> <img src="./images/users.jpg"> </div> </div> <div class="chat-left-page name"><div class="chat-left-display-name"><p>' +  data.un + '</p></div></div></div>');
});
socket.on("server-send-chat-person", function (data) {
  var newData = data.my;
  $('#last-mes-' + newData.slice(2)).html(data.un);
})
socket.on("server-send-Messages-person", function (data) {
  $('#chat-container').append('<div class="chat-left"><div class="chat-left-page image"><div class="chat-left-display-image"> <img src="./images/users.jpg"> </div> </div> <div class="chat-left-page name"><div class="chat-left-display-name"><p>' + data.un + '</p></div></div></div>');
})
/* su kien tao phong chat */
socket.on("server-send-list-room", function(data) {
  var items = $('ul.user-main-container>li');
  var check = true;
  $.each(items, function (index, node) {
    var idRoom = 'N-' + data;
    if (idRoom == (node.getAttribute('id')))
      check = false;
  })
  if (check == true)
  {
    data.map(function (element) {
      $('#listUser').append('<li class="user-main-container-inside" id="N-' + element + '"><div class="user-main-inside photo"><div class="user-main-image"><img src="./images/users.jpg"></div></div><div class="user-main-inside text"><div class="user-main-name"><p>' + element + '</p></div><div class="user-main-message"><div class="user-last-message message"><p id="last-mes-' + element +'">Last seen message</p></div><div class="user-last-message date"><p>Date</p></div></div></div></li>');
    });
  } else {
    alert('Nhom ' + data + ' da ton tai');
  }
    
});

socket.on("server-send-chat-room-room", function (data) {
  var newData = data.rm;
  $('#last-mes-' + newData.slice(2)).html(data.un);
  

})
socket.on("server-send-room-yourself", function (data) {
  $('#chat-container').append('<div class="chat-right"><div class="chat-right-page image"><div class="chat-display-image"><img src="./images/check.jfif"></div></div><div class="chat-right-page name"><div class="chat-display-name"><p>' + data.un + '</p></div></div></div>');
})
socket.on("server-send-room-friends", function (data) {
  $('#chat-container').append('<div class="chat-left"><div class="chat-left-page image"><div class="chat-left-display-image"> <img src="./images/users.jpg"> </div> </div> <div class="chat-left-page name"><div class="chat-left-display-name"><p>' + data.un + '</p></div></div></div>');
})

socket.on("server-send-user-joined-room", function (data) {
  $('#user-profile-name').html('');
  data.map(function (element) {
    $('#user-profile-name').append(element + ' ');
  });
})