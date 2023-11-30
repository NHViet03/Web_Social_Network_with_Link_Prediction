const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");

const commentCtrl = {
  createComment: async (req, res) => {
    try {
      const { content, postId, postUserId } = req.body;

      const newComment = new Comments({
        content,
        user: req.user._id,
        postId,
        postUserId,
      });

      await newComment.save();

      const post = await Posts.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        },
        {
          new: true,
        }
      )
        .populate("user", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "avatar username fullname",
          },
        });

      return res.json({
        msg: "Đã tạo bình luận thành công",
        newPost: post,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  likeComment: async (req, res) => {
    try {
      const { id } = req.params;

      const comment = await Comments.find({
        _id: id,
        likes: req.user.id,
      });
      if (comment.length > 0) {
        return res.status(400).json({
          msg: "Bạn đã thích bình luận này",
        });
      }

      await Comments.findOneAndUpdate(
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
        msg: "Đã thích bình luận",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unLikeComment: async (req, res) => {
    try {
      const { id } = req.params;

      await Comments.findOneAndUpdate(
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
        msg: "Đã hủy thích bình luận",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const { id,postId } = req.params;

      await Comments.deleteOne({ _id: id });
      await Posts.findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $pull: { comments: id },
        }
      );
      return res.json({
        msg: "Đã xóa thích bình luận",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = commentCtrl;
