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
      let newText = text;
      if (text == "" && media.length > 0) {
        newText = "Đã gửi một phương tiện";
      }
      // recipientList = recipient
     let recipientList = [...recipient];

     //if recipient[] has no req.user._id.toString() push(req.user._id.toString())
      if (!recipientList.includes(req.user._id.toString())) {
        recipientList.push(req.user._id.toString());
      } 

      if (!recipient || (!newText.trim() && media.length === 0 && !call)) return;

      let conversation = await Conversations.findOne({
        recipients: { $all: recipientList, $size: recipientList.length },
      });

      if (!conversation) {
        conversation = await Conversations.create({
          recipients: recipientList,
          text : newText,
          media,
          call,
          isGroup: recipient.length > 1 ? true : false,
          isRead: {
            [sender]: true,
            [recipient]: false,
          },
        });
      } else {
        conversation.text = newText;
        conversation.media = media;
        conversation.call = call;
        conversation.isRead = {
          [sender]: true,
          [recipient]: false,
        };
        await conversation.save();
      }


      // kiểm tra rằng newConversation.recipientAccept với các key[sender, recipient] có là true hay không
      if (conversation.recipientAccept) {
        const allAccepted =
          conversation.recipientAccept.get(sender) === true &&
          conversation.recipientAccept.get(recipient) === true;
        if (!allAccepted) {
          //find User recipient
          const recipientUser = await User.findOne({ _id: recipient });

          const isSenderInFollowing = recipientUser.following.includes(sender);

          // Cập nhật recipientAccept map

          const AcceptedRecepiant =
            conversation.recipientAccept.get(recipient) === true;

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
            { _id: conversation._id },
            { $set: { recipientAccept: recipientAcceptMap } }
          );
        }
      }

      const recipients = recipientList.filter((item) => item !== sender);
      const newMessage = new Messages({
        conversation: conversation._id,
        sender,
        call,
        recipients: recipients,
        text: newText,
        media,
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
  readMessage: async (req, res) => {
    try {
      const listId = req.params.id.split(".");
      const userID = req.user._id;
      const recipientList = [...listId, userID.toString()];

      const conversation = await Conversations.findOne({
        recipients: { $all: recipientList, $size: recipientList.length },
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
      // may be req.params.id like that: 67c3e08776a9ee127c26240e.67c3f264f042c866508255a5.67c3f9b19c797e619cd729e0 => spilt by "."
      const listId = req.params.id.split(".");
      if (listId.length > 1) {
          const orConditions = listId.map((senderId) => {
            const recipientList = listId.filter(id => id !== senderId);
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
        .populate("conversation", "isGroup");

      res.json({
        messages,
        result: messages.length,
      });
    }
    catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteConversation: async (req, res) => {
    const listID = req.params.id.split(".")
    //if listID has no req.user._id.toString() push(req.user._id.toString())
    if (!listID.includes(req.user._id.toString())) {
      listID.push(req.user._id.toString());
    }
    try {
      const newConversation = await Conversations.findOneAndDelete({
        recipients: { $all: listID, $size: listID.length },
      });

      await Messages.deleteMany({ conversation: newConversation._id });

      res.json({ msg: "Deleted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = messageCtrl;
