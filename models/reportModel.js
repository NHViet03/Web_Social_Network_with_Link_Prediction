const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    id: mongoose.Types.ObjectId,
    content: String,
    type: {
      type: String,
      default: "post",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "post",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("report", reportSchema);
