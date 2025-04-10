const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    deviceId: { type: String, required: true },
    networkIp: { type: String },
    browserInfo: { type: String },
    deviceName: { type: String },
    country: { type: String },
    city: { type: String },
    accessDate: { type: Date, default: Date.now() },
    isBlocked: {type:Boolean, default: false},
  },
  {
    timestamps: true,
  }
);

deviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

module.exports = mongoose.model("device", deviceSchema);
