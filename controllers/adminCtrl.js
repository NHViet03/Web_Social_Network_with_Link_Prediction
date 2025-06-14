const Users = require("../models/userModel");
const Posts = require("../models/postModel");
const Reports = require("../models/reportModel");
const ObjectId = require("mongoose").Types.ObjectId;
const nodemailer = require("nodemailer");

const adminCtrl = {
  getHomeInfoCards: async (req, res) => {
    const { interval } = req.params;
    try {
      const newUsers = await Users.aggregate([
        {
          $match: {
            role: "user",
            createdAt: {
              $gte: new Date(
                new Date().setDate(new Date().getDate() - Number(interval))
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $count: {} },
          },
        },
      ]);

      const newUsersBefore = await Users.aggregate([
        {
          $match: {
            role: "user",
            createdAt: {
              $gte: new Date(
                new Date().setDate(new Date().getDate() - Number(interval * 2))
              ),
              $lt: new Date(
                new Date().setDate(new Date().getDate() - Number(interval))
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $count: {} },
          },
        },
      ]);

      const newPosts = await Posts.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date().setDate(new Date().getDate() - Number(interval))
              ),
            },
          },
        },
        {
          $project: {
            likes: {
              $size: "$likes",
            },
          },
        },
      ]);

      const newPostsBefore = await Posts.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date().setDate(new Date().getDate() - Number(interval * 2))
              ),
              $lt: new Date(
                new Date().setDate(new Date().getDate() - Number(interval))
              ),
            },
          },
        },
        {
          $project: {
            likes: {
              $size: "$likes",
            },
          },
        },
      ]);

      const newLikes = newPosts.reduce((total, item) => total + item.likes, 0);

      const newLikesBefore = newPostsBefore.reduce(
        (total, item) => total + item.likes,
        0
      );

      const newReports = await Reports.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date().setDate(new Date().getDate() - Number(interval))
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $count: {} },
          },
        },
      ]);

      const newReportsBefore = await Reports.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date().setDate(new Date().getDate() - Number(interval * 2))
              ),
              $lt: new Date(
                new Date().setDate(new Date().getDate() - Number(interval))
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $count: {} },
          },
        },
      ]);

      return res.json({
        newUsers: {
          present: newUsers[0]?.count || 0,
          before: newUsersBefore[0]?.count || 0,
        },
        newPosts: {
          present: newPosts.length,
          before: newPostsBefore.length,
        },
        newLikes: {
          present: newLikes,
          before: newLikesBefore,
        },
        newReports: {
          present: newReports[0]?.count || 0,
          before: newReportsBefore[0]?.count || 0,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getStatistic: async (req, res) => {
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth() - 7, 1);

    const result_users = await Users.aggregate([
      {
        $match: {
          createdAt: { $gte: startMonth },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          num: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          id: "$_id.month",
          month: { $toString: "$_id.month" },
          num: 1,
        },
      },
    ]);

    const result_posts = await Posts.aggregate([
      {
        $match: {
          createdAt: { $gte: startMonth },
          isDeleted: { $ne: true },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          num: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          id: "$_id.month",
          month: { $toString: "$_id.month" },
          num: 1,
        },
      },
    ]);

    // Generate last 8 months
    const months_users = [];
    const months_posts = [];

    for (let i = 7; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months_users.push({
        id: date.getMonth() + 1,
        month: (date.getMonth() + 1).toString(),
        num: 0,
      });
      months_posts.push({
        id: date.getMonth() + 1,
        month: (date.getMonth() + 1).toString(),
        num: 0,
      });
    }
    // Merge aggregation result with months array
    for (const m of months_users) {
      const found = result_users.find((r) => Number(r.id) === m.id);
      if (found) m.num = found.num;
    }

    // Merge aggregation result with months array
    for (const m of months_posts) {
      const found = result_posts.find((r) => Number(r.id) === m.id);
      if (found) m.num = found.num;
    }

    return res.json({
      users: months_users,
      posts: months_posts,
    });
  },
  getTop5Users: async (req, res) => {
    try {
      let users = await Users.aggregate([
        {
          $match: {
            role: "user",
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            avatar: 1,
            fullname: 1,
            email: 1,
            followers: {
              $size: "$followers",
            },
          },
        },
        {
          $sort: {
            followers: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "user",
            pipeline: [
              {
                $project: {
                  likes: {
                    $size: "$likes",
                  },
                },
              },
            ],
            as: "posts",
          },
        },
      ]);

      users = users.map((user) => {
        const likes = user.posts.reduce((total, post) => total + post.likes, 0);
        return {
          ...user,
          likes,
          posts: user.posts.length,
        };
      });

      return res.json({
        users,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const { skip, username, from, to, f_from, f_to } = req.query;

      let users = await Users.aggregate([
        {
          $match: {
            role: "user",
            username: {
              $regex: username || "",
              $options: "i",
            },
            createdAt: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            avatar: 1,
            fullname: 1,
            email: 1,
            followers: {
              $size: "$followers",
            },
            createdAt: 1,
          },
        },
        {
          $match: {
            followers: {
              $gte: Number(f_from) || 0,
              $lte: Number(f_to) || 1000,
            },
          },
        },
        {
          $skip: Number(skip) || 0,
        },
        {
          $limit: 10,
        },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "user",
            pipeline: [
              {
                $group: {
                  _id: null,
                  count: { $count: {} },
                },
              },
            ],
            as: "posts",
          },
        },
      ]);

      users = users.map((user) => ({
        ...user,
        posts: user.posts[0]?.count || 0,
      }));

      const totalUsers = await Users.aggregate([
        {
          $match: {
            role: "user",
            username: {
              $regex: username || "",
              $options: "i",
            },
            createdAt: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          },
        },
        {
          $project: {
            followers: {
              $size: "$followers",
            },
          },
        },
        {
          $match: {
            followers: {
              $gte: Number(f_from) || 0,
              $lte: Number(f_to) || 1000,
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $count: {} },
          },
        },
      ]);

      return res.json({
        users,
        result: users.length,
        totalUsers: totalUsers[0]?.count || 0,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserDetail: async (req, res) => {
    try {
      const { id } = req.params;

      let user = await Users.aggregate([
        {
          $match: {
            _id: ObjectId(id),
            role: "user",
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            avatar: 1,
            fullname: 1,
            email: 1,
            createdAt: 1,
            followers: {
              $size: "$followers",
            },
            following: {
              $size: "$following",
            },
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "user",
            pipeline: [
              {
                $project: {
                  likes: {
                    $size: "$likes",
                  },
                  comments: {
                    $size: "$comments",
                  },
                  images: {
                    $first: "$images",
                  },
                  createdAt: 1,
                },
              },
            ],
            as: "posts",
          },
        },
      ]);

      user = user[0];

      const likes = user.posts.reduce((total, post) => total + post.likes, 0);
      user.likes = likes;

      return res.json({
        user,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPosts: async (req, res) => {
    const { skip, username, from, to } = req.query;

    try {
      const posts = await Posts.aggregate([
        {
          $project: {
            user: 1,
            likes: {
              $size: "$likes",
            },
            comments: {
              $size: "$comments",
            },
            images: {
              $size: "$images",
            },
            createdAt: 1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  username: 1,
                  avatar: 1,
                },
              },
            ],
            as: "user",
          },
        },
        {
          $match: {
            "user.username": {
              $regex: username || "",
              $options: "i",
            },
            createdAt: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          },
        },
        {
          $skip: Number(skip),
        },
        {
          $limit: 10,
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      const totalPosts = await Posts.aggregate([
        {
          $project: {
            user: 1,
            createdAt: 1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  username: 1,
                },
              },
            ],
            as: "user",
          },
        },
        {
          $match: {
            "user.username": {
              $regex: username || "",
              $options: "i",
            },
            createdAt: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $count: {} },
          },
        },
      ]);

      return res.json({
        posts: posts.map((post) =>
          post.user.length > 0 ? { ...post, user: post.user[0] } : post
        ),
        result: posts.length,
        totalPosts: totalPosts[0]?.count || 0,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getDetailPost: async (req, res) => {
    try {
      const { id } = req.params;

      let post = await Posts.aggregate([
        {
          $match: {
            _id: ObjectId(id),
          },
        },
        {
          $project: {
            content: 1,
            images: 1,
            user: 1,
            createdAt: 1,
            likes: {
              $size: "$likes",
            },
            comments: 1,
            isDeleted: 1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  username: 1,
                  avatar: 1,
                  fullname: 1,
                  email: 1,
                },
              },
            ],
            as: "user",
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  content: 1,
                  likes: {
                    $size: "$likes",
                  },
                  createdAt: 1,
                  user: 1,
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "user",
                  foreignField: "_id",
                  pipeline: [
                    {
                      $project: {
                        username: 1,
                      },
                    },
                  ],
                  as: "user",
                },
              },
            ],
            as: "comments",
          },
        },
      ]);

      post = post[0];
      post.user = post.user[0] || {};
      post.comments = post.comments.map((comment) => ({
        ...comment,
        user: comment.user[0] || {},
      }));

      return res.json({
        post,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  sendMail: async (req, res) => {
    try {
      const { from, to, subject, html, attachFiles } = req.body;

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
        attachments:
          attachFiles.map((file) => ({
            filename: file.name,
            path: file.url,
          })) || [],
      };

      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Gửi Email thành công." });
      } catch (error) {
        console.log("Error in sending email", error);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getReports: async (req, res) => {
    const { skip, id, from, to, status } = req.query;

    try {
      let reports = await Reports.aggregate([
        {
          $addFields: {
            reporter: {
              $cond: [
                { $not: [{ $eq: [{ $type: "$reporter" }, "objectId"] }] },
                { $toObjectId: "$reporter" },
                "$reporter",
              ],
            },
          },
        },
        {
          $match: {
            type: "post",
            status: {
              $regex: status,
              $options: "i",
            },
            createdAt: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          },
        },
        {
          $project: {
            id: 1,
            status: 1,
            content: 1,
            reporter: 1,
            createdAt: 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "id",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  user: 1,
                  createdAt: 1,
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "user",
                  foreignField: "_id",
                  pipeline: [
                    {
                      $project: {
                        username: 1,
                        fullname: 1,
                        avatar: 1,
                        email: 1,
                      },
                    },
                  ],
                  as: "user",
                },
              },
            ],
            as: "post",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "reporter",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  username: 1,
                },
              },
            ],
            as: "reporter",
          },
        },
        {
          $match: {
            post: {
              $size: 1,
            },
          },
        },
        {
          $skip: Number(skip) || 0,
        },
        {
          $limit: 10,
        },
      ]);

      reports = reports.filter((report) => (report.id + "").includes(id));

      reports = reports.map((report) => ({
        ...report,
        post: {
          ...report.post[0],
          user: report.post[0].user[0],
        },
        reporter: report.reporter[0],
      }));

      let totalReports = await Reports.aggregate([
        {
          $match: {
            type: "post",
            status: {
              $regex: status,
              $options: "i",
            },
            createdAt: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          },
        },
        {
          $project: {
            id: 1,
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "id",
            foreignField: "_id",
            pipeline: [
              {
                $project: { _id: 1 },
              },
            ],
            as: "post",
          },
        },
        {
          $match: {
            post: {
              $size: 1,
            },
          },
        },
      ]);

      totalReports = totalReports.filter((report) =>
        (report.id + "").includes(id)
      );

      return res.json({
        reports,
        result: reports.length,
        totalReports: totalReports.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getReportDetail: async (req, res) => {
    try {
      const { id } = req.params;

      // Find the report by id and populate post and user info
      const report = await Reports.findById(id)
        .populate({
          path: "reporter",
          select: "username fullname avatar email",
        })
        .lean();

      if (!report) {
        return res.status(404).json({ msg: "Không tìm thấy báo cáo." });
      }

      // Populate post info if report.type is 'post'
      let post = null;
      if (report.type === "post" && report.id) {
        post = await Posts.findById(report.id)
          .populate({
            path: "user",
            select: "username fullname avatar email",
          })
          .lean();
      }

      return res.json({
        report,
        post,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateReport: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, deletePost } = req.body;

      const report = await Reports.findOneAndUpdate(
        { _id: id },
        { status: status }
      );

      if (status === "validated" && deletePost && report) {
        // Delete the post status if the report is validated
        const post = await Posts.findById({ _id: report.id }).populate(
          "user",
          "email username fullname"
        );

        if (post.isDeleted) {
          return res.status(200).json({ msg: "Bài viết đã bị xóa." });
        }

        post.isDeleted = true;

        // Send email notification to the reporter
        const to = post.user.email;
        const subject = "Dreamers - Điều khoản chính sách bài viết.";
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
        await post.save();
      }

      return res.json({ msg: "Cập nhật thành công." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteReport: async (req, res) => {
    try {
      const { id } = req.params;

      await Reports.findOneAndDelete({ _id: id });

      return res.json({ msg: "Xóa thành công." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  restorePost: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Posts.findById(id).populate("user", "email fullname");

      if (!post) {
        return res.status(404).json({ msg: "Bài viết không tồn tại." });
      }

      post.isDeleted = false;

      await post.save();

      // Send email notification to the user
      const to = post.user.email;
      const subject = "Dreamers - Bài viết của bạn đã được khôi phục.";
      const html = `<h4>Xin chào người dùng ${post.user.fullname},</h4>
        <p>
          Chúng tôi là Dreamers, chúng tôi quyết định khôi phục bài viết (ID: ${
            post._id
          }) được đăng tải vào lúc <em>${new Date(
        post.createdAt
      ).toLocaleString()}</em> với nội dung <strong>"${
        post.content
      }" được đăng tải cùng với ${
        post.images.length
      } hình ảnh</strong>. Bài viết của bạn đã được xác minh và khôi phục. Hiện tại bài viết có thể hiển thị lại trên nền tảng của chúng tôi.
        </p>
        <br/>
        <h5><em>Mọi thắc xin vui lòng liên hệ với chúng tôi qua gmail <u>dreamerssocialuit@gmail.com</u> hoặc liên lạc với nhân viên hỗ trợ qua số điện thoại <u>+84 123 456 789.</u></em>
        </h5>
        <p>Trân trọng,<br/>Đội ngũ Dreamers Social Network`;
      await handle_send_email(to, subject, html);
      return res.json({ msg: "Khôi phục bài viết thành công." });
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

module.exports = adminCtrl;
