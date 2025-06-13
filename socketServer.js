const Conversations = require("./models/conversationModel");
const Messages = require("./models/messageModel");

let users = [];

const EditData = (data, id, call) => {
  const newData = data.map((item) =>
    item.id === id ? { ...item, call } : item
  );
  return newData;
};

const SocketServer = (socket) => {
  // Connect - Disconnect
  socket.on("joinUser", (user) => {
    users.push({
      id: user._id,
      socketId: socket.id,
      followers: user.followers,
    });
  });

  socket.on("disconnect", () => {
    const data = users.find((user) => user.socketId === socket.id);
    if (data) {
      const clients = users.filter((user) =>
        data.followers.find((item) => item._id === user.id)
      );

      if (clients.length > 0) {
        clients.forEach((client) => {
          socket.to(`${client.socketId}`).emit("CheckUserOffline", data.id);
        });
      }
    }
    if (data?.call) {
      const callUser = users.find((user) => user.id === data.call);
      if (callUser) {
        users = EditData(users, callUser.id, null);
        socket.to(`${callUser.socketId}`).emit("callerDisconnect");
      }
    }

    users = users.filter((user) => user.socketId !== socket.id);
  });

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
  socket.on("addMessage", async (msg) => {
    //recepientList = msg.recipients filter msg.user._id
    const recepientList = msg.recipients.filter(
      (item) => item !== msg.sender._id
    );
    // usersListRecepient = là những user trong users có id trong recepientList
    const usersListRecepient = users.filter((user) =>
      recepientList.find((item) => item === user.id)
    );
    let conversationExits = null;
    if (msg.isGroup) {
      conversationExits = await Conversations.findOne({
        _id: msg.conversationID,
      }).populate("recipients", "username fullname");
    } else {
      conversationExits = await Conversations.findOne({
        recipients: { $all: msg.recipients, $size: msg.recipients.length },
      }).populate("recipients", "username fullname");
    }

    // lặp qua từng conversationExits.recipients. Join tên của những người trong conversationExits.recipients thành nameGroup
    let nameGroup = conversationExits.recipients
      .map((item) => item.username)
      .join(", ");
    msg = {
      ...msg,
      conversation: conversationExits,
      nameGroup,
    };
    // foeach user trong usersListRecepient
    usersListRecepient.length > 0 &&
      usersListRecepient.forEach((user) => {
        // emit addMessageToClient cho user đó
        socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
      });
  });

  // Check User Online / Offline
  socket.on("checkUserOnline", (data) => {
    const following = users.filter((user) =>
      data.following.find((item) => item._id === user.id)
    );
    socket.emit("checkUserOnlineToMe", following);
    const clients = users.filter((user) =>
      data.followers.find((item) => item._id === user.id)
    );
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket
          .to(`${client.socketId}`)
          .emit("checkUserOnlineToClient", data._id);
      });
    }
  });

  // editMessage
  socket.on("editMessage", async (msg) => {
    let conversationExits = null;
    if (msg.conversation.isGroup) {
      conversationExits = await Conversations.findOne({
        _id: msg.conversation.idPath,
      });
    } else {
      const listID = [msg.conversation.idPath, msg.sender._id];
      conversationExits = await Conversations.findOne({
        recipients: { $all: listID, $size: listID.length },
      });
    }
    if (!conversationExits) return;

    const recepientList = conversationExits.recipients
      .filter((item) => item._id.toString() !== msg.sender._id)
      .map((item) => item._id);
    const usersListRecepient = users.filter((user) =>
      recepientList.find((item) => item.toString() === user.id)
    );
    usersListRecepient.length > 0 &&
      usersListRecepient.forEach((user) => {
        socket.to(`${user.socketId}`).emit("editMessageToClient", msg);
      });
  });

  //revokeMessage
  socket.on("revokeMessage", async (msg) => {
    let conversationExits = null;
    if (msg.conversation.isGroup) {
      conversationExits = await Conversations.findOne({
        _id: msg.conversation.idPath,
      });
    } else {
      const listID = [msg.conversation.idPath, msg.sender._id];
      conversationExits = await Conversations.findOne({
        recipients: { $all: listID, $size: listID.length },
      });
    }
    if (!conversationExits) return;

    const recepientList = conversationExits.recipients
      .filter((item) => item._id.toString() !== msg.sender._id)
      .map((item) => item._id);
    const usersListRecepient = users.filter((user) =>
      recepientList.find((item) => item.toString() === user.id)
    );
    usersListRecepient.length > 0 &&
      usersListRecepient.forEach((user) => {
        socket.to(`${user.socketId}`).emit("revokeMessageToClient", msg);
      });
  });

  //updateManagerGroup
  socket.on("updateManagerGroup", async (data) => {
    const { userId, conversation } = data;
    const listID = conversation.recipients.map((item) => item._id);
    //nếu listID chứa userId thì xóa userId khỏi listID
    if (listID.includes(userId)) {
      listID.splice(listID.indexOf(userId), 1);
    }
    const usersListRecepient = users.filter((user) =>
      listID.find((item) => item === user.id)
    );
    usersListRecepient.length > 0 &&
      usersListRecepient.forEach((user) => {
        socket.to(`${user.socketId}`).emit("updateManagerGroupToClient", data);
      });
  });

  // removeUserFromGroup
  socket.on("removeUserFromGroup", async (data) => {
    const { userId, recepientsBeforeDelete, conversation, authUserId } = data;
    console.log("removeUserFromGroup data:", data);
    const listID = [...recepientsBeforeDelete];
    //nếu listID chứa userId thì xóa userId khỏi listID
    if (listID.includes(authUserId)) {
      listID.splice(listID.indexOf(authUserId), 1);
    }
    const usersListRecepient = users.filter((user) =>
      listID.find((item) => item === user.id)
    );
    usersListRecepient.length > 0 &&
      usersListRecepient.forEach((user) => {
        socket.to(`${user.socketId}`).emit("removeUserFromGroupToClient", data);
      });
  });
  // leaveGroupChat
  socket.on("leaveGroupChat", async (data) => {
    const { authUserId, recepientsBeforeDelete, conversation } = data;
    const listID = [...recepientsBeforeDelete];
    //nếu listID chứa authUserId thì xóa authUserId khỏi listID
    if (listID.includes(authUserId)) {
      listID.splice(listID.indexOf(authUserId), 1);
    }
    const usersListRecepient = users.filter((user) =>
      listID.find((item) => item === user.id)
    );
    usersListRecepient.length > 0 &&
      usersListRecepient.forEach((user) => {
        socket.to(`${user.socketId}`).emit("leaveGroupChatToClient", data);
      });
  });

  // addMemberGroupChat
  socket.on("addMemberGroupChat", async (data) => {
    const { conversation, authUserId } = data;

    const listID = conversation.recipients.map((item) => item._id);
    //nếu listID chứa authUserId thì xóa authUserId khỏi listID
    if (listID.includes(authUserId)) {
      listID.splice(listID.indexOf(authUserId), 1);
    }
    const usersListRecepient = users.filter((user) =>
      listID.find((item) => item === user.id)
    );
    usersListRecepient.length > 0 &&
      usersListRecepient.forEach((user) => {
        socket.to(`${user.socketId}`).emit("addMemberGroupChatToClient", data);
      });
  });

  // createGroupChat
  socket.on("createGroupChat", async (data) => {
    const { userData, senderID, recipients } = data;
    users.forEach((user) => {
      if (recipients.includes(user.id)) {
        socket.to(`${user.socketId}`).emit("createGroupChatToClient", {
          userData,
        });
      }
    });
  });

  // Call
  socket.on("callUser", (data) => {
    users = EditData(users, data.sender, data.recipient);

    const client = users.find((user) => user.id === data.recipient);
    if (client) {
      if (client.call) {
        users = EditData(users, data.sender, null);
        socket.emit("userBusy", data);
      } else {
        users = EditData(users, data.recipient, data.sender);
        socket.to(`${client.socketId}`).emit("callUserToClient", data);
      }
    }
  });
  socket.on("endCall", (data) => {
    console.log("endCall data:", data);
    const client = users.find((user) => user.id === data.sender);
    if (client) {
      socket.to(`${client.socketId}`).emit("endCallToClient", data);
      users = EditData(users, client.id, null);
      if (client.call) {
        const clientCall = users.find((user) => user.id === client.call);
        clientCall &&
          socket.to(`${clientCall.socketId}`).emit("endCallToClient", data);

        users = EditData(users, client.call, null);
      }
    }
    users = EditData(users, data.sender, null);
    users = EditData(users, data.recipient, null);
  });
};

module.exports = SocketServer;
