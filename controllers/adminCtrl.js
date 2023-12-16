const Users = require("../models/userModel");
const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
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
  sendMail: async (req,res)=>{
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
        html:html,
        attachments: attachFiles.map((file) => ({
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
  }
};

module.exports = adminCtrl;
