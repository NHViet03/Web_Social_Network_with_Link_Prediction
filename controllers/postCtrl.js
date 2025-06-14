const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
const Users = require("../models/userModel");
const Reports = require("../models/reportModel");
const Hashtags = require("../models/hashtagsModel");

const nodemailer = require("nodemailer");

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

      const responsePost = await Posts.findById(newPost._id)
        .populate("user", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "avatar username fullname",
          },
        })
        .populate("tags", "avatar username")
        .lean();

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

      const parentComments = responsePost.comments.filter(
        (comment) =>
          comment.replyCommentId == null || comment.replyCommentId === undefined
      );

      for (const comment of parentComments) {
        const replies = responsePost.comments.filter(
          (reply) =>
            reply.replyCommentId &&
            reply.replyCommentId.toString() === comment._id.toString()
        );

        comment["replies"] = replies;
      }

      responsePost.comments = parentComments;

      return res.json({
        msg: "Đã tạo bài viết thành công",
        post: responsePost,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getPosts: async (req, res) => {
    const features = new APIfeatures(
      Posts.find({
        user: [...req.user.following, req.user._id],
        isDeleted: { $ne: true },
      }),
      req.query
    ).paginating();

    try {
      const posts = await features.query
        .sort("-createdAt")
        .populate("user", "avatar username fullname")
        .populate({
          path: "comments",
          populate: [
            {
              path: "user",
              select: "avatar username fullname",
            },
          ],
        })
        .populate("tags", "avatar username")
        .lean();

      for (const post of posts) {
        const parentComments = post.comments.filter(
          (comment) =>
            comment.replyCommentId == null ||
            comment.replyCommentId === undefined
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
      }

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
      const post = await Posts.findOne({
        _id: req.params.id,
        isDeleted: { $ne: true },
      })
        .populate("user", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "avatar username fullname",
          },
        })
        .populate("tags", "avatar username")
        .lean();

      if (!post) {
        return res.status(404).json({ msg: "Bài viết không tồn tại" });
      }

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

      // await Comments.deleteMany({ postId: id });
      await Posts.findOneAndUpdate(
        { _id: id },
        {
          isDeleted: true,
        }
      );

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
          isDeleted: { $ne: true },
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
        .populate("tags", "avatar username")
        .lean();

      for (const post of posts) {
        const parentComments = post.comments.filter(
          (comment) =>
            comment.replyCommentId == null ||
            comment.replyCommentId === undefined
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
      }

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
          isDeleted: { $ne: true },
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
          isDeleted: { $ne: true },
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
          isDeleted: { $ne: true },
        }),
        req.query
      ).paginating();
      const posts = await features.query
        .sort("-createdAt")
        .populate("tags", "avatar username")
        .lean();

      for (const post of posts) {
        const parentComments = post.comments.filter(
          (comment) =>
            comment.replyCommentId == null ||
            comment.replyCommentId === undefined
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
      }

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
          isDeleted: { $ne: true },
        }),
        req.query
      ).paginating();

      const savePosts = await features.query.sort("-createdAt");

      res.json({
        savePosts,
        result: savePosts.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getTaggedPosts: async (req, res) => {
    try {
      const { id } = req.params;

      const features = new APIfeatures(
        Posts.find({
          tags: id,
          isDeleted: { $ne: true },
        }),
        req.query
      ).paginating();

      const taggedPosts = await features.query.sort("-createdAt");

      res.json({
        data: taggedPosts,
        result: taggedPosts.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  report_notification: async (req, res) => {
    try {
      const { id } = req.params;

      const report = await Reports.findById(id);

      const post = await Posts.findById(report.id).populate(
        "user",
        "email fullname"
      );

      if (!report) {
        return res.status(404).json({ msg: "Báo cáo không tồn tại" });
      }

      if (!post) {
        return res.status(404).json({ msg: "Bài viết không tồn tại" });
      }

      if (report.status != "pending") {
        return res.status(400).json({ msg: "Báo cáo đã được xử lý" });
      }

      if (post.isDeleted) {
        return res.status(400).json({ msg: "Bài viết đã bị xóa" });
      }

      const report_id = report.report_id;

      const prediction = report.predictions.find(
        (prediction) => prediction.id === report_id
      );

      const to = post.user.email;
      const subject = "Dreamers - Điều khoản chính sách bài viết.";
      // Threshold for determining if the report is handled
      // if prediction >= 70%, delete the post and send email notification to the user
      if (prediction && prediction.probability >= 70.0) {
        report.status = "validated";
        post.isDeleted = true;
        await report.save();
        await post.save();

        const html = `<h4>Xin chào người dùng ${post.user.fullname},</h4>
        <p>
          Chúng tôi là Dreamers, chúng tôi đã phát hiện bài viết của bạn (ID: ${
            post._id
          }) được đăng tải vào lúc <em>${new Date(
          post.createdAt
        ).toLocaleString()}</em> với nội dung <strong>"${
          post.content
        }" được đăng tải cùng với ${
          post.images.length
        } hình ảnh</strong> đã vi phạm chính sách bài viết của chúng tôi với lý do: <strong>"${
          report.content
        }"</strong>. Vì vậy, bài viết của bạn sẽ bị cấm hiển thị trong thời gian tới.
        <p>
        <br/>
        <h5><em>Mọi thắc hoặc kháng cáo xin vui lòng liên hệ với chúng tôi qua gmail <u>dreamerssocialuit@gmail.com</u> hoặc liên lạc với nhân viên hỗ trợ qua số điện thoại <u>+84 123 456 789.</u></em>
        </h5>
        <p>Trân trọng,<br/>Đội ngũ Dreamers Social Network`;

        await handle_send_email(to, subject, html);

        return res.json({
          msg: "Bài viết đã bị xóa do vi phạm chính sách bài viết",
        });
      }

      // If the prediction >= 50% but < 70%, send warning notification to the user but do not delete the post
      if (prediction && prediction.probability >= 50.0) {
        const html = `<h4>Xin chào người dùng ${post.user.fullname},</h4>
        <p>
          Chúng tôi là Dreamers, chúng tôi đã phát hiện bài viết của bạn (ID: ${
            post._id
          }) được đăng tải vào lúc <em>${new Date(
          post.createdAt
        ).toLocaleString()}</em> với nội dung <strong>"${
          post.content
        }" được đăng tải cùng với ${
          post.images.length
        } hình ảnh</strong> có dấu hiệu vi phạm chính sách bài viết của chúng tôi với lý do: <strong>"${
          report.content
        }"</strong>. Bài viết của bạn vẫn được hiển thị, tuy nhiên chúng tôi sẽ xem xét thêm trước khi có quyết định cụ thể.
        <p>
        <br/>
        <h5><em>Mọi thắc hoặc kháng cáo xin vui lòng liên hệ với chúng tôi qua gmail <u>dreamerssocialuit@gmail.com</u> hoặc liên lạc với nhân viên hỗ trợ qua số điện thoại <u>+84 123 456 789.</u></em>
        </h5>
        <p>Trân trọng,<br/>Đội ngũ Dreamers Social Network`;

        await handle_send_email(to, subject, html);

        return res.json({
          msg: "Bài viết đã được xem xét, chúng tôi sẽ thông báo cho bạn sau khi có quyết định cụ thể",
        });
      }

      report.status = "rejected";
      await report.save();
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const handle_send_email = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dreamerssocialuit@gmail.com",
        pass: "pwxdinwdinhfjwvf",
      },
    });

    const mailOptions = {
      from: "dreamerssocialuit@gmail.com",
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error in sending email", error);
  }
};

module.exports = postCtrl;
