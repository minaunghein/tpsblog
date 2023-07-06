const router = require("express").Router();
const Authorize = require("../Utils/middleware/authorize");
const PostController = require("../Controllers/post");
const fileUpload = require("../Utils/middleware/fileupload");

router
  .route("/")
  .get(PostController.getPost) //TODO: need to add pagination
  .post(Authorize, fileUpload, PostController.createPost);

router
  .route("/:id")
  .delete(Authorize, PostController.deletePost)
  .put(Authorize, fileUpload, PostController.updatePost);
module.exports = router;
