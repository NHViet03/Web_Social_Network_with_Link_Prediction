const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
const Users = require("../models/userModel");
const Reports = require("../models/reportModel");
const Hashtags = require("../models/hashtagsModel");

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
      const { content, images, hashtags, tags, location } = req.body;
      if (images.length === 0) {
        return res
          .status(400)
          .json({ msg: "Vui lòng thêm ảnh để tạo bài viết." });
      }

      const newPost = new Posts({
        content,
        images,
        user: req.user._id,
        hashtags,
        tags,
        location,
      });

      await newPost.save();

      const resonsePost = await Posts.findById(newPost._id).populate(
        "tags",
        "username"
      );

      // Insert hashtags into Hashtags collection if not exists
      for (let hashtag of hashtags) {
        const checkExists = await Hashtags.exists({
          name: hashtag,
        });

        if (!checkExists) {
          const newHashtag = new Hashtags({
            name: hashtag,
          });

          newHashtag.save();
        }
      }

      return res.json({
        msg: "Đã tạo bài viết thành công",
        post: resonsePost,
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
        })
        .populate("tags", "avatar username");

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
        })
        .populate("tags", "avatar username");

      return res.json({
        post,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updatePost: async (req, res) => {
    try {
      const { content, hashtags, tags, location } = req.body;

      await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
          hashtags,
          tags,
          location,
        }
      );

      for (let hashtag of hashtags) {
        const checkExists = await Hashtags.exists({
          name: hashtag,
        });

        if (!checkExists) {
          const newHashtag = new Hashtags({
            name: hashtag,
          });

          newHashtag.save();
        }
      }

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
        })
        .populate("tags", "avatar username");

      return res.json({
        posts,
        result: posts.length,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getExplorePostsByLocation: async (req, res) => {
    try {
      const { id } = req.params;

      const features = new APIfeatures(
        Posts.find({
          "location.id": id,
        }),
        req.query
      ).paginating();

      const posts = await features.query.sort("-createdAt");

      return res.json({
        posts,
        result: posts.length,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getExplorePostsByHashtag: async (req, res) => {
    try {
      const { id } = req.params;

      const features = new APIfeatures(
        Posts.find({
          hashtags: id,
        }),
        req.query
      ).paginating();

      const posts = await features.query.sort("-createdAt");

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
      const posts = await features.query
        .sort("-createdAt")
        .populate("tags", "avatar username");
      res.json({
        posts,
        result: posts.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  reportPost: async (req, res) => {
    try {
      const { id, reason, reporter } = req.body;

      const newReport = new Reports({
        id,
        reason,
        reporter,
      });

      await newReport.save();

      res.json({
        msg: "Đã gửi báo cáo thành công",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getSavePosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({
          _id: { $in: req.user.saved },
        }),
        req.query
      ).paginating();

      const savePosts = await features.query
        .sort("-createdAt")
        .populate("tags", "avatar username");

      res.json({
        savePosts,
        result: savePosts.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = postCtrl;
