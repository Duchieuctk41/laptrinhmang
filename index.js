const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const direction = require('./routes/direction.router');
const server = require('http').Server(app);
const path = require('path');
var io = require('socket.io')(server);
const port = 3000;
server.listen(port, function() {
    console.log('Server listening on port ' + port);
});

var arrayUsers = [];
io.on("connection", function(socket) {
    console.log("co nguoi vua ket noi, socket id: " + socket.id);
    socket.on("disconnect", function() {
        console.log(socket.id + "da ngat ket noi");
    });
    socket.on("Client-send-UserName", function(data) {
        console.log(data);
        if (arrayUsers.indexOf(data) >= 0) {
            socket.emit("Server-send-Register-false");
        } else {
            arrayUsers.push(data);
            socket.Username = data;
            socket.emit("Server-send-Register-true", data);
            io.sockets.emit("Server-send-arrayUsers", arrayUsers)
        }
    });
    socket.on("logout", function() {
        arrayUsers.splice(
            arrayUsers.indexOf(socket.Username), 1
        );
        socket.broadcast.emit("Server-send-arrayUsers", arrayUsers);
    });
    socket.on("user-send-Messages", function(data) {
        io.sockets.emit("server-send-Messages", { un: socket.Username, nd: data });
    });
    socket.on("I-am-writing", function() {
        var s = socket.Username + ' Dang go chu';
        io.sockets.emit("someone-are-writing", s);
    });
    socket.on("I-am-not-writing", function() {

        io.sockets.emit("someone-are-stop-writing");
    });
});


app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(direction);