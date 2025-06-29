const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: String,
    images: {
      type: Array,
      required: true,
    },
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
    hashtags: [{ type: String, index: true }],
    tags: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    location: {
      id: { type: String, index: true },
      name: String,
    },
    isDeleted:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

postSchema.index({ tags: 1 });

module.exports = mongoose.model("post", postSchema);
