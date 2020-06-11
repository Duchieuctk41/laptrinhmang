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
var logger = require('morgan')
const path = require('path');
var flash = require("connect-flash");
const port = 3000;
let account = require('./models/Accounts');
let room = require('./models/Room');
let conversation = require('./models/Conversation');
const { fchown } = require('fs');
//Set Template Engine
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
///
//
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//
//Set Passport
app.use(session({
  secret: "mysecret",
  cookie: { maxAge: 1000 * 60 * 5000 },
  resave: true,
  saveUninitialized: true,
  unset: 'destroy',
}));

//Use authencation
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(direction);
require('./configs/passport')(passport);
server.listen(port, function () {
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


var i = 0;
io.on("connection", function (socket) {
  console.log("co nguoi vua ket noi, socket id: " + socket.id);
  i++;
  console.log("co " + i + " nguoi da ket noi");
  socket.emit("server-send-people", i);
  socket.on("disconnect", function () {
    i--;
    console.log(socket.id + "da ngat ket noi");
    console.log("co " + i + " nguoi da ket noi");
    socket.emit("server-send-people-leave", i);
  });
  socket.on("user-send-username", function () {
    var data = {};
    account.find({}, (err, result) => {
      result.forEach(Element => {
        data = { P: Element.TaiKhoan };

        socket.emit("Server-send-username", data.P);
      })

    })
  });


  socket.on("user-send-room", function () {
    room.find({}, (err, result) => {
      var data = {}
      result.forEach(Element => {
        data = { N: Element.TenNhom}
        socket.emit("Server-send-room", data.N);
      })
    });
  });


  /*tao room moi*/
  socket.on("user-send-create-room", function (data) {
    socket.join(data);
    room.insertMany({ TenNhom: data }, (err, resslut) => {
      console.log(resslut);
    });
    socket.Phong = data;
    var arrayRoom = [];
    for (r in socket.adapter.rooms) {
      if (r == data)
        arrayRoom.push(r);
    }
    io.sockets.emit("server-send-list-room", arrayRoom);
  });
  /* su kien join room*/

  socket.on("user-send-join-room", function (data) {
    socket.join(data.crRoom);
    var crR = data.crRoom.slice(2);
    room.updateMany({ TenNhom: crR }, { $addToSet: { Name: data.userJoin } }, (err, result) => {
        console.log(result);
      });;

 room.find({}, (err, result) => {
        var data = {};
        result.forEach(Element => {
          if (Element.TenNhom == crR)
            data = { N: Element.Name }
          io.sockets.emit("server-send-user-joined-room", data.N);
        })
      });


     
    });
     
     
    

  socket.on("user-send-join-person", function (data) {
    socket.join(data);
  });
  socket.on("user-send-join-person", function (data) {
    socket.join(data);
  });

  /* nhan du lieu input tu client*/
  socket.on("user-send-Messages-room", function (data) {
    io.sockets.in(data.rm).emit("server-send-chat-room-room", data);
    socket.emit("server-send-Messages-yourself", data);
    socket.broadcast.in(data.rm).emit("server-send-room-friends", data);
  });
  socket.on("user-send-conversation-room", function (data) {

    var crR = data.rm.slice(2);
    // conversation.updateMany({ TenNhom: crR }, { $push:  dialogue: {data.nm} }, (err, result) => {
    //   console.log(result);
    // });;
    
  })

  socket.on("user-send-Messages-person", function (data) {
    io.sockets.in(data.rm).emit("server-send-chat-room-room", data);
    socket.emit("server-send-Messages-yourself", data);
    // io.sockets.in(data.my).emit("server-send-chat-person", data);
    socket.broadcast.emit("server-send-chat-person", data);
    socket.broadcast.in(data.my).emit("server-send-Messages-person", data);
    // socket.broadcast.emit("server-send-Messages-person", data);
  })
  socket.on("user-send-Messages-all", function (data) {
    io.sockets.emit("server-send-Messages-all", data);
    socket.emit("server-send-Messages-yourself", data);
    socket.broadcast.emit("server-send-Messages-friends", data);
  });

});