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
