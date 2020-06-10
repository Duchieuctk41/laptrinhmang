$(document).ready(function() {
    $('#loginForm').show();
    $('#chatForm').hide();

    $('#btnRegister').click(function() {
        socket.emit("Client-send-UserName", $("#txtUserName").val());
    });
    $('#send').bind("enterKey", function(e) {
        //do stuff here
    });
    $('#send').keypress(function(e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
            socket.emit("user-send-Messages", $('#send').val());
            $('#send').val('');
        }
    });

    $('#btnCreateRoom').click(function() {
        socket.emit("user-send-create-room", $('#txtCreateRoom').val());
    });
    $(document).on('click', '#newbie aa', function() {
        alert('fdkl');
        $('.navbar-name').html('<p><b>ádfgh</b></p>');


    });
});