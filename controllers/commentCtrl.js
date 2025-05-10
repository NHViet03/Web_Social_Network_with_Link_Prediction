const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");

const commentCtrl = {
  createComment: async (req, res) => {
    try {
      const { content, postId, postUserId, replyCommentId, replyUser } =
        req.body;

      const newComment = new Comments({
        content,
        user: req.user._id,
        postId,
        postUserId,
        replyCommentId,
        replyUser: replyUser,
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
        })
        .lean();

      const parentComments = post.comments.filter(
        (comment) =>
          comment.replyCommentId == null || comment.replyCommentId === undefined
      );

      for (const comment of parentComments) {
        const replies = post.comments.filter(
          (reply) =>
            reply.replyCommentId &&
            reply.replyCommentId.toString() === comment._id.toString()
        );

        comment["replies"] = replies;
      }

      post.comments = parentComments;

      return res.json({
        msg: "Đã tạo bình luận thành công",
        newPost: post,
        comment: newComment,
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
      const { id, postId } = req.params;

      await Comments.deleteOne({ _id: id });

      const replies = await Comments.find({ replyCommentId: id }, { _id: 1 });

      if (replies.length > 0) {
        await Comments.deleteMany({ _id: { $in: replies } });
      }

      await Posts.findOneAndUpdate(
        { _id: postId },
        {
          $pull: {
            comments: { $in: [id, ...replies.map((r) => r._id)] },
          },
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
