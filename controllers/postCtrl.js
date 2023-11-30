const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;
      if (images.length === 0) {
        return res
          .status(400)
          .json({ msg: "Vui lòng thêm ảnh để tạo bài viết." });
      }

      const newPost = new Posts({
        content,
        images,
        user: req.user._id,
      });

      await newPost.save();
      return res.json({
        msg: "Đã tạo bài viết thành công",
        post: newPost._doc,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getPosts: async (req, res) => {
    try {
      const posts = await Posts.find({
        user: [...req.user.following, req.user._id],
      })
        .sort("-createdAt")
        .populate("user", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "avatar username fullname",
          },
        });

      return res.json({
        posts,
        result: posts.length,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updatePost: async (req, res) => {
    try {
      const { content } = req.body;
      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
        }
      );

      return res.json({
        msg: "Cập nhật thành công",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;

      await Comments.deleteMany({ postId: id });
      await Posts.findOneAndDelete({ _id: id, user: req.user._id });

      return res.json({
        msg: "Đã xóa bài viết thành công",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  likePost: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Posts.find({
        _id: id,
        likes: req.user.id,
      });
      if (post.length > 0) {
        return res.status(400).json({
          msg: "Bạn đã thích bài viết này",
        });
      }

      await Posts.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            likes: req.user._id,
          },
        },
        {
          new: true,
        }
      );
      return res.json({
        msg: "Đã thích bài viết",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unLikePost: async (req, res) => {
    try {
      const { id } = req.params;

      await Posts.findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            likes: req.user._id,
          },
        },
        {
          new: true,
        }
      );
      return res.json({
        msg: "Đã hủy thích bài viết",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};


module.exports = postCtrl;
