const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    postid: { type: mongoose.Schema.ObjectId, required: true, ref: "Post" },
    userid: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
    desc: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
