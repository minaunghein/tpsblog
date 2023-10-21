const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    userid: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    imageurl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
