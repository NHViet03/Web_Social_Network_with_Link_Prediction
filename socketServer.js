let users = [];

const SocketServer = (socket) => {
  // Connect - Disconnect
  socket.on('joinUser', user => {
    users.push({id: user._id, socketId: socket.id, followers: user.followers})
})

socket.on('disconnect', () => {
    const data = users.find(user => user.socketId === socket.id)
    if(data){
        const clients = users.filter(user => 
            data.followers.find(item => item._id === user.id)
        )

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id)
            })
        }

    }

    users = users.filter(user => user.socketId !== socket.id)
})

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
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
    const clients = users.filter(user => data.followers.find(item => item._id === user.id))
    if(clients.length > 0){
      clients.forEach(client => {
        socket.to(`${client.socketId}`).emit("checkUserOnlineToClient", data._id)
      })
    }
  }
  );

  
};

module.exports = SocketServer;
