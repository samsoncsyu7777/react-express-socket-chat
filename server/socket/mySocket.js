var socket_io = require("socket.io");
var io = socket_io();
const db = require("../models/index");
const Message = db.message;
const Unread = db.unread;
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

var mySocket = {};
mySocket.io = io;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
var onlineUsers = [];

io.on("connection", (socket) => {
  var authenticated = false;
  var userId = 0;
  token = socket.handshake.headers.cookie.split("jwt=")[1];

  jwt.verify(token, config.secret, (err, decoded) => {
    if (decoded) {
      userId = decoded.id;
      authenticated = true;
    }
  });

  const { roomId, username } = socket.handshake.query;

  if (username && roomId && authenticated) {
    if (!onlineUsers.includes(username)) {
      onlineUsers.push(username);
      io.sockets.emit('broadcast', { onlineUsers: onlineUsers });
    }
  }

  if (roomId && authenticated) {
    socket.join(roomId);
  }

  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    if (data.message != "" && roomId && authenticated) {
      io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, { data: data });
      Message.create({
        messageString: data.message,
        userId: data.userId,
        dialogId: roomId
      })
      Unread.increment('value', {where: {dialogId: roomId, friendId: data.userId}});
    }
  });

  socket.on("disconnect", () => {
    const index = onlineUsers.indexOf(username);
    if (index > -1) {
      onlineUsers.splice(index, 1);
      io.sockets.emit('broadcast', { onlineUsers: onlineUsers });
      socket.leave(roomId);
    }
  });
});

module.exports = mySocket;
