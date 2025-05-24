const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: 'conversation' },
    sender: { type: mongoose.Types.ObjectId, ref: 'user' },
    recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    replymessage: { type: mongoose.Types.ObjectId, ref: 'message' },
    isRevoke: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
    isVisible: {
        type: Map,
        of: Boolean,
        default: {}
      },
    text: String,
    media: Array,
    call: Object
}, {
    timestamps: true
})

module.exports = mongoose.model('message', messageSchema)  