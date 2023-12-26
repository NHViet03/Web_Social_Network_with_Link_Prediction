const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content:String,
    images:{
        type:Array,
        required:true
    },
    user:{type:mongoose.Types.ObjectId,ref:'user'},
    likes:[{type:mongoose.Types.ObjectId,ref:'user'}],
    comments:[{type:mongoose.Types.ObjectId,ref:'comment'}]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", postSchema);
