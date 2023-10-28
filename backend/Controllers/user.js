const {
  comparePassword,
  hashPassword,
  findUserByUsername,
  generateToken,
  expiresDuration,
  createUser,
  registerValidate,
} = require("../Services/user");
const AppError = require("../Utils/errorThrow");
const User = require("../Models/user");
// throw new AppError()
exports.login = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.username) {
      throw new AppError("Please define a username", 400);
    }

    if (!body.password) {
      throw new AppError(400, "Please define a password", 400);
    }

    const findUser = await findUserByUsername(body.username).populate(
      "password"
    );

    const validateUser = !findUser
      ? false
      : await comparePassword(body.password, findUser.password);

    if (!validateUser) {
      throw new AppError("Invalid username or password", 401);
    }

    const token = generateToken(findUser);
    return res.status(200).json({
      token_type: "Bearer",
      access_token: token,
      expiresIn: expiresDuration,
      userid: findUser._id,
    });
  } catch (error) {
    next(error);
  }
};

/*
const id = req.user.id;
  // console.log(id)
  const username = req.user.username;
  const companyID = req.user.companyID;
  User.findOne({
    $or: [
      { _id: id, companyID: companyID, deleted: false },
      { username: username, companyID: companyID, deleted: false },
    ],
  })
    .populate(["company"])
    .then((document) => {
      var data = document.toObject();

      //Check user data efficiency
      if (data.role == Role.Employee) {
        data.isbiocomplete = false; //Need to check boolean value in UserSchema
      } else data.isbiocomplete = true;

      data.id = document._id;
      return res.status(200).json({
        message: ["User Info found!"],
        data: data,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        error: [`${err.message}`],
        message: "User Info fetching error!",
      });
    });*/

 

exports.register = async (req, res, next) => {
  try {
    const body = req.body;

    if (body.password !== body.confirmPassword) {
      throw new AppError("Password must be same", 400);
    }

    await registerValidate.validate(body);

    body.password = await hashPassword(body.password);

    const user = await createUser(body);

    const token = generateToken(user);
    return res.status(200).json({
      token_type: "Bearer",
      access_token: token,
      expiresIn: expiresDuration,
      userid: user._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      error.message = "Duplicate user";
    }
    next(error);
  }
};

exports.getUserInfo = async (req, res, next) => {
  try {
    const user = req.user;

    const getUser = await User.findById(user.id);

    if (!getUser) {
      throw new AppError("User not found", 404);
    }

    const { password, ...userInfo } = getUser._doc;

    return res.status(200).json({ data: userInfo });
  } catch (error) {
    next(error);
  }
};
