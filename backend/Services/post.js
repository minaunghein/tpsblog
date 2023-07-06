const Post = require("../Models/post");
const Like = require("../Models/like");
const User = require("../Models/user");

exports.getAllPost = () =>
  Post.find()
    .sort({ updatedAt: -1 })
    .populate({ path: "userid", select: ["firstname", "lastname"] });

exports.getAllPostByUser = (userid, page, pagesize) =>
  Post.aggregate([
    {
      $lookup: {
        from: User.collection.name,
        localField: "userid",
        foreignField: "_id",
        as: "userid",
        pipeline: [{ $project: { firstname: 1, lastname: 1, profileurl: 1 } }],
      },
    },
    { $unwind: "$userid" },
    {
      $lookup: {
        from: Like.collection.name,
        localField: "_id",
        foreignField: "postid",
        as: "likes",
      },
    },
    {
      $set: {
        likeIndex: { $indexOfArray: ["$likes", userid] },
      },
    },
    {
      $set: {
        isliked: {
          $cond: {
            if: { $eq: ["$likeIndex", -1] },
            then: false,
            else: true,
          },
        },
        likes: { $size: "$likes" },
      },
    },
    {
      $project: {
        likeIndex: 0,
      },
    },
    { $sort: { updatedAt: -1 } },
    {
      $skip: pagesize * (page - 1),
    },
    {
      $limit: parseInt(pagesize),
    },
  ]);

exports.countAllPost = () => Post.countDocuments();

exports.createPost = (post, userid) => Post.create({ ...post, userid });

exports.PostService = (postid) => {
  let id = postid;

  const returnObj = { findOnePost, deletePost, updatePost };
  function findOnePost() {
    return Post.findById(id);
  }

  function deletePost() {
    return Post.findByIdAndDelete(id);
  }

  function updatePost(payload) {
    return Post.findByIdAndUpdate(id, { $set: payload }, { new: true });
  }

  return returnObj;
};
