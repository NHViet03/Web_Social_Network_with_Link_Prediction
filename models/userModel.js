const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    birthday: { type: Date, default: "" },
    avatar: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/036/280/651/large_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
    },
    role: { type: String, default: "user" },
    gender: { type: String, default: "male" },
    story: {
      type: String,
      default: "",
      maxlength: 200,
    },
    website: {
      type: String,
      default: "",
    },
    otpcode: { type: String, default: "" },
    isVerify: { type: Boolean, default: false },
    followers: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    saved: [{ type: mongoose.Types.ObjectId, ref: "post" }],
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
