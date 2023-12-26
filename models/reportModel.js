const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    id: mongoose.Types.ObjectId,
    reason: String,
    type: {
      type: String,
      default: "post",
    },
    status: {
      type: String,
      default: "pending",
    },
    reporter: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("report", reportSchema);
