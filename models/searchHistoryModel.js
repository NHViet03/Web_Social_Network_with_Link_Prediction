const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    histories: [
      {
        _id: { type: mongoose.Types.ObjectId },
        title: { type: String, required: true },
        subtitle: { type: String },
        image: { type: String },
        type: { type: String, required: true, enum: ["user", "hashtag"] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("searchHistory", searchHistorySchema);
