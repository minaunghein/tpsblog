const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, requried: true },
    profileurl: { type: String },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
