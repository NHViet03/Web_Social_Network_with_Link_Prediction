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
      const { sender, recipient, text, media, call } = req.body;

      if (!recipient || (!text.trim() && media.length === 0 && !call)) return;

      const newConversation = await Conversations.findOneAndUpdate(
        {
          $or: [
            { recipients: [sender, recipient] },
            { recipients: [recipient, sender] },
          ],
        },
        {
          recipients: [sender, recipient],
          text,
          media,
          call,
        },
        { new: true, upsert: true }
      );

      // kiểm tra rằng newConversation.recipientAccept với các key[sender, recipient] có là true hay không
      if (newConversation.recipientAccept) {
        const allAccepted =
          newConversation.recipientAccept.get(sender) === true &&
          newConversation.recipientAccept.get(recipient) === true;
        if (!allAccepted) {
          //find User recipient
          const recipientUser = await User.findOne({ _id: recipient });

          const isSenderInFollowing = recipientUser.following.includes(sender);

          // Cập nhật recipientAccept map

          const AcceptedRecepiant =
            newConversation.recipientAccept.get(recipient) === true;

          let recipientAcceptMap;
          if (AcceptedRecepiant) {
            recipientAcceptMap = {
              [sender]: true,
              [recipient]: true,
            };
          } else {
            recipientAcceptMap = {
              [sender]: true,
              [recipient]: isSenderInFollowing,
            };
          }
          await Conversations.updateOne(
            { _id: newConversation._id },
            { $set: { recipientAccept: recipientAcceptMap } }
          );
        }
      }
      const newMessage = new Messages({
        conversation: newConversation._id,
        sender,
        call,
        recipient,
        text,
        media,
      });

      await newMessage.save();

      res.json({ 
        msg: "Create Success!",
        conversation: newConversation
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
    if (req.query.mainBoxMessage !== undefined) {
      const mainBoxMessage = req.query.mainBoxMessage === 'true';
      filter[`recipientAccept.${req.user._id}`] = mainBoxMessage;
    }

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
        [key]: false
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
  readMessage: async (req, res) => {
    try {
      const { id } = req.params;
      const userID = req.user._id;

      const conversation = await Conversations.findOne({
        $or: [
          { recipients: [userID, id] },
          { recipients: [id, userID] },
        ],
      });

      if (!conversation) return res.status(400).json({ msg: "Not found!" });

      conversation.isRead.set(userID.toString(), true);
       await conversation.save();

      res.json({ msg: "Read Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getMessages: async (req, res) => {
    try {
      const features = new APIfeatures(
        Messages.find({
          $or: [
            { sender: req.user._id, recipient: req.params.id },
            { sender: req.params.id, recipient: req.user._id },
          ],
        }),
        req.query
      ).paginating();

      const messages = await features.query
        .sort("-createdAt")
        .populate("recipients", "avatar username fullname");

      res.json({
        messages,
        result: messages.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteConversation: async (req, res) => {
    try {
      const newConversation = await Conversations.findOneAndDelete({
        $or: [
          { recipients: [req.user._id, req.params.id] },
          { recipients: [req.params.id, req.user._id] },
        ],
      });

      await Messages.deleteMany({ conversation: newConversation._id });

      res.json({ msg: "Deleted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = messageCtrl;
