const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    text: String,
    media: Array,
    call: Object,
    recipientAccept: {
        type: Map,
        of: Boolean,
        default: {}
      },
    isRead: {
        type: Map,
        of: Boolean,
        default: {}
      }, 
}, {
    timestamps: true
})

module.exports = mongoose.model('conversation', conversationSchema)  