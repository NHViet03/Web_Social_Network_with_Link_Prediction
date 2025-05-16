const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: String,
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
    replyCommentId: {
      type: mongoose.Types.ObjectId,
      ref: "comment",
      index: true,
    },
    replyUser: {
      userId: { type: mongoose.Types.ObjectId, ref: "user" },
      username: String,
    },
    image:String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", commentSchema);
