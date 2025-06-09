const Conversations = require("../models/conversationModel");
const Messages = require("../models/messageModel");
const User = require("../models/userModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  paginating() {
    const limit = this.queryString.limit * 1 || 10;
    this.query = this.query.limit(limit);
    return this;
  }
}

const messageCtrl = {
  createMessage: async (req, res) => {
    try {
      const {
        sender,
        recipients,
        _id,
        text,
        media,
        call,
        replymessage,
        isGroup,
        conversationID,
      } = req.body;
      const senderId = sender._id;
      let newText = text;
      if (text == "" && media.length > 0) {
        newText = "Đã gửi một phương tiện";
      }
      // recipientList : danh sách người nhận, bao gồm cả người gửi
      // senderId: người gửi tin nhắn
      // recipients: mảng người nhận tin nhắn ( bao gồm cả người gửi )
      // recipientsNosender: danh sách người nhận không bao gồm người gửi
      const recipientList = [...recipients];
      if (!recipientList.includes(senderId)) {
        recipientList.push(senderId);
      }
      const recipientsNosender = recipientList.filter(
        (item) => item !== senderId
      );

      if (!recipientList || (!newText.trim() && media.length === 0 && !call))
        return;
      let conversation = null;
      if (isGroup) {
        conversation = await Conversations.findById(conversationID);
      } else {
        // Tìm kiếm conversation với recipients là một mảng chứa sender và recipient
        conversation = await Conversations.findOne({
          recipients: { $all: recipientList, $size: recipientList.length },
        });
      }

      if (!conversation) {
        const recipientAccept = {};

        for (const recipient of recipientList) {
          if (recipient === senderId) {
            recipientAccept[recipient] = true;
          } else {
            const userRecipientAccept = await User.findById(recipient);
            recipientAccept[recipient] =
              userRecipientAccept.following.includes(senderId);
          }
        }
        conversation = await Conversations.create({
          recipients: recipientList,
          text: newText,
          media,
          call,
          // admins: [], // admins: mảng người quản trị cuộc trò chuyện, hiện tại để trống
          // nếu là cuộc trò chuyện nhóm thì sẽ có nhiều người quản trị, nếu là cuộc trò chuyện cá nhân thì không có người quản trị
          admins: [],
          // host: người tạo cuộc trò chuyện, nếu là nhóm thì sẽ là người đầu tiên trong danh sách
          // nếu là cuộc trò chuyện nhóm thì sẽ có nhiều người nhận, nếu là cuộc trò chuyện cá nhân thì chỉ có 2 người
          host: recipientList.length > 2 ? senderId : null,
          isGroup: recipientList.length > 2 ? true : false,
          // isVisible: một mảng key-value với key là recipient
          // và value là true (hiện thị cuộc trò chuyện với người nhận) ( thường là chức năng xóa đoạn chat)
          isVisible: recipientList.reduce((acc, recipient) => {
            acc[recipient] = true;
            return acc;
          }, {}),
          // isRead: một mảng key-value với key là recipient
          // và value là false (chưa đọc) với người gửi là true
          // tính năng: đánh dấu cuộc trò chuyện là đã đọc với người gửi, chưa đọc với người nhận
          isRead: recipientList.reduce((acc, recipient) => {
            // nếu recipient là senderId thì set là true (đã đọc), còn lại là false (chưa đọc)
            acc[recipient] = recipient === senderId ? true : false;
            return acc;
          }, {}),
          // newConversation.recipientAccept: là mảng key-value với key là recipient
          // và value là true (đã chấp nhận cuộc trò chuyện) với người gửi là true
          // tính năng: ở hộp tin nhắn chờ ( những người nào chưa theo dõi nhau sẽ ở hộp tin nhắn chờ ) >< tương ứng với recipientAccept[recipient] = false
          // Đang hard code: tất cả đều là true => đều ở tin nhắn chính
          recipientAccept: recipientAccept,
        });
      } else {
        conversation.text = newText;
        conversation.media = media;
        conversation.call = call;
        conversation.isVisible = recipientList.reduce((acc, recipient) => {
          acc[recipient] = true;
          return acc;
        }, {});
        // conversation.recipientAccept không thay đổi gì, chỉ cập nhật recipientAccept[senderId] = true
        conversation.recipientAccept.set(senderId.toString(), true);
        conversation.isRead = recipientList.reduce((acc, recipient) => {
          // nếu recipient là senderId thì set là true (đã đọc), còn lại là false (chưa đọc)
          acc[recipient] = recipient === senderId ? true : false;
          return acc;
        }, {});
        await conversation.save();
      }

      const newMessage = new Messages({
        _id: _id,
        conversation: conversation._id,
        sender: senderId,
        call,
        recipients: recipientsNosender,
        text: newText,
        replymessage: replymessage,
        isRevoke: false,
        isEdit: false,
        media,
        isVisible: recipientList.reduce((acc, recipient) => {
          acc[recipient] = true;
          return acc;
        }, {}),
      });

      await newMessage.save();

      res.json({
        msg: "Create Success!",
        conversation: conversation,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createGroupChat: async (req, res) => {
    try {
      const { senderID, recipients } = req.body;
      var userSender = await User.findById(senderID);
      const recipientList = [...recipients, senderID];
      // Tạo một cuộc trò chuyện mới với recipients là một mảng chứa sender và recipient
      const conversation = await Conversations.create({
        recipients: recipientList,
        text: `${userSender.username} đã tạo cuộc trò chuyện nhóm`,
        media: [],
        call: null,
        admins: [], // người tạo cuộc trò chuyện là người quản trị
        host: userSender._id, // người tạo cuộc trò chuyện là người chủ
        isGroup: true, // cuộc trò chuyện nhóm
        isVisible: recipientList.reduce((acc, recipient) => {
          acc[recipient] = true;
          return acc;
        }, {}),
        isRead: recipientList.reduce((acc, recipient) => {
          // nếu recipient là sender thì set là true (đã đọc), còn lại là false (chưa đọc)
          acc[recipient] = recipient === senderID ? true : false;
          return acc;
        }, {}),
        recipientAccept: recipientList.reduce((acc, recipient) => {
          acc[recipient] = true;
          return acc;
        }, {}),
      });
      // Trả về conversation.populate("recipients", "avatar username fullname");
      const newConversation = await Conversations.findById(
        conversation._id
      ).populate("recipients", "avatar username fullname");
      // Trả về cuộc trò chuyện mới
      res.json({
        msg: "Create Group Chat Success!",
        conversation: newConversation,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getConversations: async (req, res) => {
    try {
      const mainBoxMessage = req.query.mainBoxMessage === "true" ? true : false;
      // Tạo bộ lọc ban đầu: user phải là một recipient
      const filter = {
        recipients: req.user._id,
      };
      // Lọc theo trạng thái recipientAccept của user
      filter[`recipientAccept.${req.user._id}`] = mainBoxMessage;
      //lọc theo isVisible của user

      // Áp dụng phân trang (chỉ có limit theo class bạn cung cấp)
      const features = new APIfeatures(
        Conversations.find(filter),
        req.query
      ).paginating();

      const conversations = await features.query
        .sort("-updatedAt")
        .populate("recipients", "avatar username fullname");

      res.json({
        conversations,
        result: conversations.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getConversation: async (req, res) => {
    try {
      // listId from /:id
      const conversationID = req.params.id;
      //Tìm kiếm cuộc trò chuyện với recipients là một mảng chứa listID
      const conversation = await Conversations.findOne({
        _id: conversationID,
      })
        .populate("recipients", "avatar username fullname")
        .populate("sender", "avatar username fullname");
      if (!conversation) return res.json({ msg: "Not found!" });
      res.json({
        conversation,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getNumberNewMessage: async (req, res) => {
    try {
      const userId = req.user._id;
      const key = `isRead.${userId}`;

      const numberNewMessage = await Conversations.countDocuments({
        recipients: userId,
        [key]: false,
        [`isVisible.${userId}`]: true,
      });

      res.json({ numberNewMessage });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  removeAdminGroup: async (req, res) => {
    try {
      const conversationID = req.params.id;
      const { userId } = req.body;
      const conversation = await Conversations.findById(conversationID);
      if (!conversation) return res.json({ msg: "Not found!" });

      // Xóa userId khỏi danh sách admin
      conversation.admins = conversation.admins.filter(
        (admin) => admin.toString() !== userId
      );

      // Lấy thông tin của người dùng từ User model
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ msg: "User not found!" });

      // Thêm text : user.username vào conversation
      conversation.text = `${user.username} đã bị gỡ quyền quản trị viên.`;

      await conversation.save();

      // Tìm lại conversation sau khi cập nhật
      const updatedConversation = await Conversations.findById(
        conversationID
      ).populate("recipients", "avatar username fullname");

      res.json({
        msg: "Remove admin success!",
        conversation: updatedConversation,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  setAdminGroup: async (req, res) => {
    try {
      const conversationID = req.params.id;
      const { userId } = req.body;
      const conversation = await Conversations.findById(conversationID);
      if (!conversation) return res.json({ msg: "Not found!" });
      // Kiểm tra xem userId đã là admin chưa
      if (conversation.admins.includes(userId)) {
        return res.status(400).json({ msg: "User is already an admin!" });
      }
      // Thêm userId vào danh sách admin
      conversation.admins.push(userId);

      // Lấy thông tin người dùng từ User model
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ msg: "User not found!" });

      // Thêm text : user.username vào conversation
      conversation.text = `${user.username} đã trở thành quản trị viên.`;
      await conversation.save();
      // Tìm lại conversation sau khi cập nhật
      const updatedConversation = await Conversations.findById(
        conversationID
      ).populate("recipients", "avatar username fullname");
      res.json({
        msg: "Set admin success!",
        conversation: updatedConversation,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  acceptConversation: async (req, res) => {
    const sender = req.user._id.toString();
    let listID = req.body.listID;
    // nếu listID chưa có sender thì thêm vào
    if (!listID.includes(sender)) {
      listID.push(sender);
    }
    try {
      const conversation = await Conversations.findOne({
        recipients: { $all: listID, $size: listID.length },
      });
      if (!conversation) return res.json({ msg: "Not found!" });

      // set  key conversation.recipientAccept[sender]  with value true
      conversation.recipientAccept.set(sender.toString(), true);

      await conversation.save();

      res.json({ msg: "Accepted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  revokeMessage: async (req, res) => {
    try {
      const message = await Messages.findById(req.params.id);
      if (!message) return res.status(400).json({ msg: "Not found!" });

      message.isRevoke = true;
      await message.save();

      res.json({ msg: "Revoke Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  editMessage: async (req, res) => {
    try {
      const { textEdit } = req.body;
      const message = await Messages.findById(req.params.id);
      if (!message) return res.status(400).json({ msg: "Not found!" });

      message.text = textEdit;
      message.isEdit = true;

      await message.save();

      res.json({ msg: "Edit Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  readMessage: async (req, res) => {
    try {
      const userID = req.params.id;
      const { listID, isGroup, conversationID } = req.body;

      let conversation = null;

      if (isGroup) {
        // nếu là cuộc trò chuyện nhóm thì tìm kiếm theo conversationID
        conversation = await Conversations.findById(conversationID);
      } else {
        conversation = await Conversations.findOne({
          recipients: { $all: listID, $size: listID.length },
        });
      }
      // nếu không tim thấy conversation thì không cần làm gì

      if (conversation) {
        // set lại conversation.isRead[userID] = true;
        //còn lại vẫn giữ nguyên giá trị cũ
        conversation.isRead.set(userID, true);
        await conversation.save();
        res.json({ msg: "Read Success!" });
      } else {
        return res.json({ msg: "No conversation found!" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getMessages: async (req, res) => {
    try {
      const isGroup = req.query.isGroup === "true" ? true : false;
      const conversationID = req.query.conversationID;
      if (isGroup) {
        // find sender = req.user._id, and recipients include all id in listId
        features = new APIfeatures(
          Messages.find({
            conversation: conversationID,
          }),
          req.query
        ).paginating();
      } else {
        features = new APIfeatures(
          Messages.find({
            $or: [
              {
                sender: req.user._id,
                recipients: [req.params.id],
              },
              {
                sender: req.params.id,
                recipients: [req.user._id],
              },
            ],
          }),
          req.query
        ).paginating();
      }

      const messages = await features.query
        .sort("-createdAt")
        .populate("recipients", "avatar username fullname")
        .populate("sender", "avatar username fullname")
        .populate("conversation", "isGroup")
        .populate({
          path: "replymessage",
          select: "text media sender isRevoke",
          populate: {
            path: "sender",
            select: "fullname username",
          },
        });

      res.json({
        messages,
        result: messages.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteConversation: async (req, res) => {
    const listID = req.params.id.split(".");
    //if listID has no req.user._id.toString() push(req.user._id.toString())
    if (!listID.includes(req.user._id.toString())) {
      listID.push(req.user._id.toString());
    }
    try {
      const newConversation = await Conversations.findOne({
        recipients: { $all: listID, $size: listID.length },
      });

      newConversation.isVisible.set(req.user._id.toString(), false);
      await newConversation.save();

      // update many messages with conversation = newConversation._id
      await Messages.updateMany(
        { conversation: newConversation._id },
        { $set: { [`isVisible.${req.user._id}`]: false } }
      );

      res.json({ msg: "Deleted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = messageCtrl;
