const Users = require("../models/userModel");
const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
const Reports = require("../models/reportModel");
const ObjectId = require("mongoose").Types.ObjectId;

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
};

module.exports = adminCtrl;
