const Post = require("../Models/post");
const {
  getAllPost,
  getAllPostByUser,
  createPost,
  PostService,
  countAllPost,
} = require("../Services/post");
const AppError = require("../Utils/errorThrow");
exports.getPost = async (req, res, next) => {
  try {
    const user = req.user;
    const pagesize = +req.query.pagesize;
    const page = +req.query.page;
    const posts = await getAllPostByUser(user?.id, page, pagesize);

    const count = await countAllPost();

    const lastpage = Math.ceil(count / pagesize);

    return res.status(200).json({
      meta: {
        current_page: parseInt(page),
        last_page: lastpage,
        per_page: parseInt(pagesize),
        total: count,
      },
      data: posts,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const body = req.body;
    console.log(body);
    console.log(req.file);
    const userid = req.user.id;
    let imagePath = "";
    if (req.file) {
      let url = req.protocol + "://" + req.get("host");
      url = url.endsWith("/") ? url : url + "/";
      imagePath = url + "resources/images/" + req.file.filename;
    }
    if (!body.desc) {
      throw new AppError("Please input description", 400);
    }
    const post = await createPost({ ...body, imageurl: imagePath }, userid);
    await post.populate({ path: "userid", select: ["firstname", "lastname"] });
    return res.status(200).json({ data: post });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const userid = req.user.id;
    const postid = req.params.id;
    const postService = PostService(postid);

    const post = await postService.findOnePost();
    if (!post.userid.equals(userid)) {
      throw new AppError("You are not the owner of post", 401);
    }
    await postService.deletePost();

    return res
      .status(200)
      .json({ message: "Post has been deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const body = req.body;
    const userid = req.user.id;
    const postid = req.params.id;
    console.log(req.file);
    if (req.file) {
      let url = req.protocol + "://" + req.get("host");
      url = url.endsWith("/") ? url : url + "/";
      body.imageurl = url + "resources/images/" + req.file.filename;
    }
    const postService = PostService(postid);
    const findPost = await postService.findOnePost();
    if (!findPost) {
      throw new AppError("Post not found", 404);
    }
    if (!findPost.userid.equals(userid)) {
      throw new AppError("You are not the owner of post", 401);
    }
    const post = await postService.updatePost(body);

    await post.populate({ path: "userid", select: ["firstname", "lastname"] });

    return res.status(201).json({ data: post });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
