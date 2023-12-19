let users = [];

const SocketServer = (socket) => {
  // Connect - Disconnect
  socket.on("joinUser", (id) => {
    users.push({ id, socketId: socket.id });
  });

  // Notify
  socket.on("createNotify", (notify) => {
    const userArr = users.filter((user) => notify.recipients.includes(user.id));

    userArr.forEach((user) => {
      socket.to(user.socketId).emit("createNotifyToClient", notify);
    });
  });

  socket.on("removeNotify", (msg) => {
    
    const userArr = users.filter((user) =>
      msg.recipients.find((item) => item._id === user.id)
    );

    userArr.forEach((user) => {
      socket.to(user.socketId).emit("removeNotifyToClient", msg);
    });
  });
  // Message
  socket.on("addMessage", msg =>{
    const user = users.find(user => user.id === msg.recipient)
    user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg)
  })
  // Check User Online / Offline
  socket.on("checkUserOnline", (data) => {
   const following = users.filter(user => data.following.find(item => item._id === user.id))
    socket.emit("checkUserOnlineToMe", following)
  }
  );
};

module.exports = SocketServer;
