const mongoose = require("mongoose");

const LikeSchema = mongoose.Schema(
  {
    postid: { type: mongoose.Schema.ObjectId, required: true, ref: "Post" },
    userid: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", LikeSchema);
