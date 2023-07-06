const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const yup = require("yup");

const config = require("../Config/config.json");

const SALT = 10;

exports.expiresDuration = "7d";

exports.comparePassword = (password, hash) => bcrypt.compare(password, hash);

exports.hashPassword = (password) => bcrypt.hash(password, SALT);

exports.findUserById = (userid) => User.findById(userid);

exports.findUserByUsername = (username) => User.findOne({ username });

exports.createUser = (user) => User.create(user);

exports.generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      name: user.firstname + " " + user.lastname,
      email: user.email,
      profileurl: user.profileurl,
    },
    config.secret,
    { expiresIn: exports.expiresDuration }
  );

exports.registerValidate = yup.object({
  username: yup.string().required("Please define a username"),
  email: yup.string().email().required("Please define an email"),
  firstname: yup.string().required("Please define a fistname"),
  lastname: yup.string().required("Please define a lastname"),
  password: yup.string().min(6).required("Please define a password"),
});
