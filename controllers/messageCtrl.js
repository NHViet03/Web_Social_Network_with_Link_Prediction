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
      const { sender, recipients, _id, text, media, call, replymessage } =
        req.body;
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
      const recipientsNosender = recipientList.filter(
        (item) => item !== senderId
      );

      if (!recipientList || (!newText.trim() && media.length === 0 && !call))
        return;

      // Tìm kiếm conversation với recipients là một mảng chứa sender và recipient
      let conversation = await Conversations.findOne({
        recipients: { $all: recipientList, $size: recipientList.length },
      });

      if (!conversation) {
        conversation = await Conversations.create({
          recipients: recipientList,
          text: newText,
          media,
          call,
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
          recipientAccept: recipientList.reduce((acc, recipient) => {
            acc[recipient] = true;
            return acc;
          }, {}),
        });
      } else {
        conversation.text = newText;
        conversation.media = media;
        conversation.call = call;
        (conversation.isVisible = recipientList.reduce((acc, recipient) => {
          acc[recipient] = true;
          return acc;
        }, {})),
          (conversation.recipientAccept = recipientList.reduce(
            (acc, recipient) => {
              acc[recipient] = true;
              return acc;
            },
            {}
          )),
          (conversation.isRead = recipientList.reduce((acc, recipient) => {
            // nếu recipient là senderId thì set là true (đã đọc), còn lại là false (chưa đọc)
            acc[recipient] = recipient === senderId ? true : false;
            return acc;
          }, {}));
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
  getConversations: async (req, res) => {
    try {
      // Tạo bộ lọc ban đầu: user phải là một recipient
      const filter = {
        recipients: req.user._id,
      };

      // Nếu có truyền mainBoxMessage (dưới dạng chuỗi "true"/"false"), lọc thêm theo recipientAccept
      // if (req.query.mainBoxMessage !== undefined) {
      //   const mainBoxMessage = req.query.mainBoxMessage === "true";
      //   filter[`recipientAccept.${req.user._id}`] = mainBoxMessage;
      // }

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
  getNumberNewMessage: async (req, res) => {
    try {
      const userId = req.user._id;
      const key = `isRead.${userId}`;

      const numberNewMessage = await Conversations.countDocuments({
        recipients: userId,
        [key]: false,
      });

      res.json({ numberNewMessage });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  acceptConversation: async (req, res) => {
    const sender = req.body.auth.user._id;
    const recipient = req.body.id;
    try {
      const conversation = await Conversations.findOne({
        $or: [
          { recipients: [sender, recipient] },
          { recipients: [recipient, sender] },
        ],
      });
      if (!conversation) return res.status(400).json({ msg: "Not found!" });

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
      const listID = req.body.listID;

      const conversation = await Conversations.findOne({
        recipients: { $all: listID, $size: listID.length },
      });

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
      // may be req.params.id like that: 67c3e08776a9ee127c26240e.67c3f264f042c866508255a5.67c3f9b19c797e619cd729e0 => spilt by "."
      const listId = req.params.id.split(".");
      if (listId.length > 1) {
        const orConditions = listId.map((senderId) => {
          const recipientList = listId.filter((id) => id !== senderId);
          return {
            sender: senderId,
            recipients: { $all: recipientList, $size: recipientList.length },
          };
        });
        // find sender = req.user._id, and recipients include all id in listId
        features = new APIfeatures(
          Messages.find({
            $or: orConditions,
          }),
          req.query
        ).paginating();
      } else if (listId.length === 1) {
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
          select: "text media sender",
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
