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
let privateMessage = require('./models/PrivateMessage');
const { fchown } = require('fs');
const { all } = require('./routes/direction.router');
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
server.listen(process.env.PORT, function () {
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
io.on("connection", function (socket, req) {
  i++;
  console.log(socket.id);
  console.log("co " + i + " nguoi da ket noi");
  socket.emit("server-send-people", i);
  account.find({ Status: true }, (err, result) => {
    console.log(result.TaiKhoan);
    io.sockets.emit("server-update-people-online", result);
  })
  socket.on("disconnect", function () {
    i--;
    console.log(socket.id + "da ngat ket noi");
    console.log("co " + i + " nguoi da ket noi");
    socket.emit("server-send-people-leave", i);
  });
  /*hien thi danh sach nguoi dung*/
  socket.on("user-send-username", function () {
    var data = {};
    account.find({}, (err, result) => {
      result.forEach(Element => {
        data = { P: Element.TaiKhoan, S: Element.Status };
        socket.emit("Server-send-username", data);
      })
    })
  });
  /*su kien  khi 1 nguoi log out*/
  socket.on("user-send-one-person-log-out", function (data) {
    io.sockets.emit("server-send-one-person-log-out", data);
  })

  socket.on("user-send-room", function () {
    room.find({}, (err, result) => {
      var data = {}
      result.forEach(Element => {
        data = { N: Element.TenNhom }
        socket.emit("Server-send-room", data.N);
      })
    });
  });

  socket.on("user-request-history-chat-all", function (data) {

    conversation.findOne({ TenNhom: 'All' }, (err, result) => {
      socket.emit("server-send-history-chat-all", result);
    })
  });
  /*tao room moi*/
  socket.on("user-send-create-room", function (data) {
    socket.join(data);
    room.insertMany({ TenNhom: data }, (err, resslut) => {
      console.log('Client vừa thêm 1 nhóm mới');
    });
    conversation.insertMany({ TenNhom: data }, (err, resslut) => {

    });
    // tao mang tam luu phong moi nhap
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
    //update database room va conversation
    room.updateMany({ TenNhom: crR }, { $addToSet: { Name: data.userJoin } }, (err, result) => {
    });
    conversation.findOne({ TenNhom: crR }, (err, result) => {
      socket.emit("server-send-history-chat-room", result);
      // console.log(result);
    })
    room.find({}, (err, result) => {
      var data = {};
      result.forEach(Element => {
        if (Element.TenNhom == crR)
          data = { N: Element.Name }
        io.sockets.emit("server-send-user-joined-room", data.N);
      })
    });
  });
  socket.on("user-send-join-all", function (data) {
    conversation.findOne({ TenNhom: 'All' }, (err, result) => {
      io.sockets.emit("server-send-history-chat-all", result);
    })
  });
  socket.on("user-send-join-person", function (data) {
    var crR = data.toPerson.slice(2) + 'va' + data.myPerson;
    var crR2 = data.myPerson + 'va' + data.toPerson.slice(2);
    console.log(crR2);

    // socket.join(crR2);
    //kiem tra database da ton tai chua, co bi trung ko
    privateMessage.find({ TenNhom: crR2 }, (err, result) => {

      privateMessage.find({ TenNhom: crR }, (error, res) => {
        if (result.length == 0 && res.length == 0) {
          socket.join(crR);
          console.log('1')
          privateMessage.insertMany({ TenNhom: crR }, (err, result) => {
            console.log('them thanh cong 1 doi tuong: ' + result);
          })
        } else if (res.length == 0) {
          socket.join(crR);
          console.log('2')
          io.sockets.in(crR).emit("server-send-history-chat-private", result);

        } else {
          socket.join(crR2);
          console.log('3', res);
          io.sockets.in(crR2).emit("server-send-history-chat-private", res);
        }
      });
    });

  });
  /* nhan du lieu input tu client*/
  socket.on("user-send-Messages-room", function (data) {
    io.sockets.in(data.rm).emit("server-send-chat-room-room", data);
    socket.emit("server-send-Messages-yourself", data);
    socket.broadcast.in(data.rm).emit("server-send-room-friends", data);
  });
  /*them tin nhan moi vao database*/
  socket.on("user-send-conversation-private", function (data) {

    var crR = data.rm + 'va' + data.tp;
    var crR2 = data.tp + 'va' + data.rm;
    privateMessage.updateMany({ TenNhom: crR }, { $push: { namePerson: data.nm, dialogue: data.ct } }, (err, result) => {
      console.log(result);
    });
    privateMessage.updateMany({ TenNhom: crR2 }, { $push: { namePerson: data.nm, dialogue: data.ct } }, (err, result) => {
      console.log(result);
    });

  });

  socket.on("user-send-conversation-room", function (data) {

    var crR = data.rm.slice(2);
    conversation.updateMany({ TenNhom: crR }, { $push: { namePerson: data.nm, dialogue: data.ct } }, (err, result) => {
      console.log('them tin nhom thanh cong');
    });
  });

  socket.on("user-send-conversation-all", function (data) {
    var crR = data.rm.slice(2);
    conversation.updateMany({ TenNhom: crR }, { $push: { namePerson: data.nm, dialogue: data.ct } }, (err, result) => {
      console.log('them tin all thanh cong');
    });
  });

  socket.on("user-send-Messages-person", function (data) {
    socket.emit("server-send-chat-person-yourself", data);
    socket.emit("server-send-Messages-yourself", data);
    // // io.sockets.in(data.my).emit("server-send-chat-person", data);
    socket.broadcast.emit("server-send-chat-person", data);
    // socket.broadcast.in(data.my).emit("server-send-Messages-person", data);
    socket.broadcast.emit("server-send-Messages-person", data);
  });

  socket.on("user-send-Messages-all", function (data) {
    io.sockets.emit("server-send-Messages-all", data);
    socket.emit("server-send-Messages-yourself", data);
    socket.broadcast.emit("server-send-Messages-friends", data);
  });
});