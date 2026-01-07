const socketIo = require("socket.io");
let io;
const Chat = require("./models/chat");
const chat = (server) => {
  io = socketIo(server);
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", (data) => {
      let { sender, receiver } = data;
      let roomName;
      if (receiver > sender) {
        roomName = sender + "_" + receiver;
      } else {
        roomName = receiver + "_" + sender;
      }
      console.log({ roomName });
      socket.join(roomName);
    });

    socket.on("message", async (data) => {
      let { sender, receiver, message } = data;
      let roomName;
      if (receiver > sender) {
        roomName = sender + "_" + receiver;
      } else {
        roomName = receiver + "_" + sender;
      }
      console.log({ roomName });
      let roomUsers = await io.in(roomName).fetchSockets();
      let msgRead = roomUsers.length > 1 ? 1 : 0;
      let msg = new Chat({
        receiver,
        sender,
        msg:message,
        msgRead,
      });
      await msg.save();
      socket.to(roomName).emit("newMessage", message);
    });

    socket.on("leaveRoom", (data) => {
      let { sender, receiver } = data;
      let roomName;
      if (receiver > sender) {
        roomName = sender + "_" + receiver;
      } else {
        roomName = receiver + "_" + sender;
      }
      console.log(`User ${socket.id} leaving room: ${roomName}`);
      socket.leave(roomName);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = { chat };
