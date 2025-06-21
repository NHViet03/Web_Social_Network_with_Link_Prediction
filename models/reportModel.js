const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    id: mongoose.Types.ObjectId,
    report_id: {
      type: Number,
      required: true
    },
    label: String,
    content: String,
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
    predictions: [
      {
        "id": Number,
        "label": String,
        "probability": Number,
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("report", reportSchema);
