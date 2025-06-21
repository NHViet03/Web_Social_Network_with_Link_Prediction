const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    recipients: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    text: String,
    media: Array,
    host: { type: mongoose.Types.ObjectId, ref: "user" },
    admins: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    call: Object,
    isVisible: {
      type: Map,
      of: Boolean,
      default: {},
    },
    recipientAccept: {
      type: Map,
      of: Boolean,
      default: {},
    },
    isRead: {
      type: Map,
      of: Boolean,
      default: {},
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("conversation", conversationSchema);
