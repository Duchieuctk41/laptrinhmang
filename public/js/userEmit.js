$(document).ready(function () {
  socket.emit("user-send-username");
  socket.emit("user-send-room");
  socket.emit("user-request-history-chat-all");

  $('#btnRegister').click(function () {
    socket.emit("Client-send-UserName", $("#txtUserName").val());
  });
  $('#send').bind("enterKey", function (e) {
    //do stuff here
  });


  /* su kien tao room chat */
  $('#btnCreateRoom').click(function () {
    socket.emit("user-send-create-room", $('#txtCreateRoom').val());
  });
  var currentRoom = 'A-All';
  var person = /^P/;
  var room = /^N/;

  /* su kien click join room chat*/
  $(document).on("click", "#listUser li", function (event) {
    currentRoom = this.id;
    if (person.test(currentRoom)) {
      var nd = $("#myUser").text();
      socket.emit("user-send-join-person", {toPerson: currentRoom, myPerson: nd});
      $('#userVictim').html(currentRoom.slice(2));
      $('#chat-container').html('');
      $('#input-send-chat').html('<input type="text" name="Send" placeholder="Type a message.." id="send-person">')
    }
    else if (room.test(currentRoom)) {
      var nd = $("#myUser").text();
      socket.emit("user-send-join-room", {crRoom: currentRoom, userJoin:nd});
      $('#userVictim').html(currentRoom.slice(2));
      $('#chat-container').html('');
      $('#input-send-chat').html('<input type="text" name="Send" placeholder="Type a message.." id="send-room">');

    } else {
      socket.emit("user-send-join-all", {userJoin: nd });
      $('#userVictim').html(currentRoom.slice(2));
      $('#chat-container').html('');
      $('#input-send-chat').html('<input type="text" name="Send" placeholder="Type a message.." id="send-all">');
    }

  });
  /*su kien chat input*/
  $(document).on("change", '#send-room', function () {
    var nd = $("#myUser").text() + " : " + $(this).val();
    var name = $("#myUser").text();
    var content = $(this).val();
    socket.emit("user-send-conversation-room", { rm: currentRoom, nm: name, ct: content });
    socket.emit("user-send-Messages-room", { rm: currentRoom, un: nd });
    $(this).val('');
  });


  $(document).on("change", '#send-all', function () {
    var nd = $("#myUser").text() + " : " + $(this).val();
    var name = $("#myUser").text();
    var content = $(this).val();
    socket.emit("user-send-conversation-all", { rm: currentRoom, nm: name, ct: content });
    socket.emit("user-send-Messages-all", { rm: currentRoom, un: nd });
    $(this).val('');
  });

  $(document).on("change", '#send-person', function () {
    var nd = $("#myUser").text() + " : " + $(this).val();
    var myId = 'P-' + $("#myUser").text();
    var name = $("#myUser").text();
    var content = $(this).val();
    var myPerson = $("#myUser").text();
    var toPerson = $('#userVictim').text();
    socket.emit("user-send-conversation-private", { rm: myPerson, tp: toPerson, nm: name, ct: content });
    socket.emit("user-send-Messages-person", { my: myId, rm: currentRoom, un: nd });
    $(this).val('');
  });
  $(document).on("submit", "#logOut", function () {
    var userLogOut = $("#myUser").text();
    socket.emit("user-send-one-person-log-out", userLogOut);
  });
  // $('#logOut').on("click", function () {
    
  // var userLogOut = $("#myUser").text();
    // socket.emit("user-send-one-person-log-out", userLogOut);
  // })
  // $(document).on("submit", 'a', function (event) {
  //   var userLogOut = $("#myUser").text();
  //   socket.emit("user-send-one-person-log-out", userLogOut);
  // });
  
   
});