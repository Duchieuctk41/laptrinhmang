const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const direction = require('./routes/direction.router');
const server = require('http').Server(app);
var io = require('socket.io')(server);
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const path = require('path');
const port = 3000;
app.use(express.static('./public'));



app.set('view engine', 'ejs');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: "mysecret",
    cookie: { maxAge: 1000 * 60 * 5000 },
    //Save session to database 
    // store: new (require('express-sessions'))({
    //     storage: 'mongodb',
    //     instance: mongoose, // optional
    //     host: 'localhost', // optional
    //     port: 27017, // optional
    //     db: 'DiemDanhDB', // optional
    //     collection: 'sessions', // optional
    //     expire: 86400 // optional
    // }),
    resave: true,
    saveUninitialized: true,
    unset: 'destroy',
}));
require('./configs/passport')(passport);
server.listen(port, function() {
    console.log('Server listening on port ' + port);
});
const mongoUri = 'mongodb+srv://duchieu:123@cluster0-jja2l.mongodb.net/Chat?retryWrites=true&w=majority';

var connectOptions = {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, connectOptions)
    .then(
        () => {
            console.log('Connected to database');
        },
        err => {
            console.log('Can\'t connect to database: ' + err);
        }
    );


var arrayUsers = ['Chat All'];
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
    socket.on("user-send-Messages", function(data) {
        io.sockets.emit("server-send-Messages", { un: socket.Username, nd: data });
        socket.emit("server-send-Messages-yourself", { un: socket.Username, nd: data });
        socket.broadcast.emit("server-send-Messages-friends", { un: socket.Username, nd: data });
    });

    socket.on("user-send-create-room", function(data) {
        socket.join(data);
        socket.Phong = data;
        var arrayRoom = [];
        for (r in socket.adapter.rooms) {
            if (r == data)
                arrayRoom.push(r);
        }
        io.sockets.emit("server-send-list-room", arrayRoom);
        socket.emit("server-send-room-socket", data);
    });

});




app.use(direction);