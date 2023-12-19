const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel')

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
            const { sender, recipient, text, media, call } = req.body

            if(!recipient || (!text.trim() && media.length === 0 && !call)) return;

            const newConversation = await Conversations.findOneAndUpdate({
                $or: [
                    {recipients: [sender, recipient]},
                    {recipients: [recipient, sender]}
                ]
            }, {
                recipients: [sender, recipient],
                text, media, call
            }, { new: true, upsert: true })

            const newMessage = new Messages({
                conversation: newConversation._id,
                sender, call,
                recipient, text, media
            })

            await newMessage.save()

            res.json({msg: 'Create Success!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getConversations: async (req, res) => {
        try {
            const features = new APIfeatures(Conversations.find({
                recipients: req.user._id
            }), req.query).paginating()

            const conversations = await features.query.sort('-updatedAt')
            .populate('recipients', 'avatar username fullname')

            res.json({
                conversations,
                result: conversations.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getMessages: async (req, res) => {
        try {
            const features = new APIfeatures(Messages.find({
                $or: [
                    {sender: req.user._id, recipient: req.params.id},
                    {sender: req.params.id, recipient: req.user._id}
                ]
            }), req.query).paginating()

            const messages = await features.query.sort('-createdAt')
            .populate('recipients', 'avatar username fullname')

            res.json({
                messages,
                result: messages.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteConversation: async (req, res) => {
        try {
            const newConversation = await Conversations.findOneAndDelete({
                $or: [
                    {recipients: [req.user._id, req.params.id]},
                    {recipients: [req.params.id, req.user._id]}
                ]
            })

            await Messages.deleteMany({conversation: newConversation._id})

            res.json({msg: 'Deleted Success!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


module.exports = messageCtrl;