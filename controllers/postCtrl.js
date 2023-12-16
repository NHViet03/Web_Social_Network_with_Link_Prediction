const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
const Users = require("../models/userModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  paginating() {
    const limit = this.queryString.limit * 1 || 10;
    this.query = this.query.limit(limit);
    return this;
  }
}

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
    const features = new APIfeatures(
      Posts.find({
        user: [...req.user.following, req.user._id],
      }),
      req.query
    ).paginating();

    try {
      const posts = await features.query
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
  getPost: async (req, res) => {
    try {
      const post = await Posts.findOne({ _id: req.params.id })
        .populate("user", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "avatar username fullname",
          },
        });

      return res.json({
        post,
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
      await Posts.findOneAndDelete({ _id: id });

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
  getExplorePosts: async (req, res) => {
    try {
      const exceptArr = [...req.user.following, req.user._id];

      const features = new APIfeatures(
        Posts.find({
          user: { $nin: exceptArr },
        }),
        req.query
      ).paginating();

      const posts = await features.query
        .sort("-createdAt")
        .populate("user", "avatar username fullname followers following")
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
  savePost: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await Users.find({
        _id: req.user._id,
        saved: id,
      });
      if (user.length > 0) {
        return res.status(400).json({
          msg: "Bạn đã lưu bài viết này",
        });
      }

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            saved: id,
          },
        },
        {
          new: true,
        }
      );
      return res.json({
        msg: "Đã lưu bài viết",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unSavePost: async (req, res) => {
    try {
      const { id } = req.params;

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: {
            saved: id,
          },
        },
        {
          new: true,
        }
      );
      return res.json({
        msg: "Đã hủy lưu bài viết",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({
          user: req.params.id,
        }),
        req.query
      ).paginating();
      const posts = await features.query.sort("-createdAt");
      res.json({
        posts,
        result: posts.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = postCtrl;
