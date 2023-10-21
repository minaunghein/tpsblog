const router = require("express").Router();
const Authorize = require("../Utils/middleware/authorize");

const UserController = require("../Controllers/user");

router.post("/login", UserController.login);

router.post("/register", UserController.register);

router.get("/", Authorize, UserController.getUserInfo);

module.exports = router;
