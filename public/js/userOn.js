var socket = io("http://localhost:3000");

socket.on("Server-send-Register-false", function() {
    alert('Ten dang ky da ton tai');
});
socket.on("Server-send-arrayUsers", function(data) {

    $('#listUser').html('')
    data.forEach(element => {
        $('#listUser').append('<div class="user-main-container-inside"><div class="user-main-inside photo"><div class="user-main-image"><img src="./images/users.jpg"></div></div><div class="user-main-inside text"><div class="user-main-name"><p>' + element + '</p></div><div class="user-main-message"><div class="user-last-message message"><p id="lastMessage">Last seen message</p></div><div class="user-last-message date"><p>Date</p></div></div></div></div>');
    });

});
socket.on("Server-send-Register-true", function(data) {
    $('#user-profile-name').html('<p><b>' + data + '</b></p>');
    $('#loginForm').hide(2000);
    $('#chatForm').show(1000);

});


socket.on("server-send-Messages", function(data) {
    $('#lastMessage').html(data.un + ' : ' + data.nd);
});
socket.on("server-send-Messages-yourself", function(data) {
    $('#chat-container').append('<div class="chat-right"><div class="chat-right-page image"><div class="chat-display-image"><img src="./images/check.jfif"></div></div><div class="chat-right-page name"><div class="chat-display-name"><p>' + data.nd + '</p></div></div></div>');
});

socket.on("server-send-Messages-friends", function(data) {
    $('#chat-container').append('<div class="chat-left"><div class="chat-left-page image"><div class="chat-left-display-image"> <img src="./images/users.jpg"> </div> </div> <div class="chat-left-page name"><div class="chat-left-display-name"><p>' + data.un + ' : ' + data.nd + '</p></div></div></div>');
});

socket.on("server-send-list-room", function(data) {
    $('#listRoom').html("");
    data.map(function(element) {
        $('#listUser').append('<div class="user-main-container-inside" id="newbie aa"><div class="user-main-inside photo"><div class="user-main-image"><img src="./images/users.jpg"></div></div><div class="user-main-inside text"><div class="user-main-name"><p>' + element + '</p></div><div class="user-main-message"><div class="user-last-message message"><p id="lastMessage">Last seen message</p></div><div class="user-last-message date"><p>Date</p></div></div></div></div>');
        // $('#listRoom').append('<h4 class="room">' + r + '</h4>');
    });
});