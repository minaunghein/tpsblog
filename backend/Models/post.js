const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    desc: { type: String, required: true },
    userid: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    imageurl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
