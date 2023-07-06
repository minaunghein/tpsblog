const config = require("../../Config/config.json");
const jwt = require("jsonwebtoken");
const { findUserById } = require("../../Services/user");

module.exports = async function (req, res, next) {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const decodeToken = jwt.verify(token, config.secret);
    const user = await findUserById(decodeToken.id);
    
    if (!token || !decodeToken.id || !user) {
      return res.status(400).json({
        errors: "Token missing or invalid",
      });
    }
    req.user = decodeToken;
    next();
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Token missing or invalid' });
  }
};
