const Users = require("../models/userModel");
const Hashtags = require("../models/hashtagsModel");
const SearchHistories = require("../models/searchHistoryModel");

const userCtrl = {
  searchUser: async (req, res) => {
    try {
      const { keyword, type } = req.query;

      let results;

      if (type === "user") {
        const users = await Users.find({
          username: { $regex: keyword, $options: "i" },
        })
          .limit(20)
          .select("fullname username avatar");

        results = users.map((user) => {
          return {
            _id: user._id,
            title: user.username,
            subtitle: user.fullname,
            image: user.avatar,
            type: "user",
          };
        });
      } else {
        const hashtags = await Hashtags.aggregate([
          {
            $match: { name: { $regex: keyword, $options: "i" } },
          },
          {
            $lookup: {
              from: "posts",
              localField: "name",
              foreignField: "hashtags",
              pipeline: [
                {
                  $group: {
                    _id: null,
                    count: { $count: {} },
                  },
                },
              ],
              as: "count",
            },
          },
          {
            $project: {
              name: 1,
              count: 1,
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $limit: 20,
          },
        ]);

        results = hashtags.map((hashtag) => ({
          _id: hashtag._id,
          title: hashtag.name,
          subtitle: hashtag.count[0]?.count || 0,
          image:
            "https://res.cloudinary.com/dswg5in7u/image/upload/v1746380552/DreamerDB/rc1ghwiruwl9crokqgve.png",
          type: "hashtag",
        }));
      }

      res.json({ results });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id)
        .select("-password")
        .populate("followers following", "-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const {
        avatar,
        fullname,
        username,
        story,
        gender,
        birthday,
        website,
        email,
      } = req.body;
      if (!fullname) return res.status(400).json({ msg: "Vui lòng nhập tên." });
      if (fullname.length > 25)
        return res
          .status(400)
          .json({ msg: "Tên không được vượt quá 25 ký tự." });
      if (!username)
        return res.status(400).json({ msg: "Vui lòng nhập tên người dùng." });
      if (username.length > 25)
        return res
          .status(400)
          .json({ msg: "Tên người dùng không được vượt quá 25 ký tự." });

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          avatar,
          fullname,
          username,
          story,
          gender,
          birthday,
          website,
          email,
        }
      );
      res.json({ msg: "Cập nhật thành công!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSuggestions: async (req, res) => {
    try {
      const exceptUsers = [...req.user.following, req.user._id];
      const num = 5;

      const users = await Users.aggregate([
        {
          $match: { _id: { $nin: exceptUsers }, role: "user" },
        },
        {
          $sample: { size: num },
        },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password");

      return res.json({
        users,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  follow: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.params.id,
        followers: req.user._id,
      });
      if (user.length > 0)
        return res.status(400).json({ msg: "Bạn đã theo dõi người dùng này." });

      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      );

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ msg: "Đã theo dõi!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      );

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ msg: "Đã hủy theo dõi!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSearchHistories: async (req, res) => {
    try {
      const searchHistories = await SearchHistories.findOne({
        user: req.user._id,
      });

      res.json({ data: searchHistories?.histories || [] });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateSearchHistory: async (req, res) => {
    const { result } = req.body;

    try {
      const searchHistory = await SearchHistories.findOne({
        user: req.user._id,
      });

      if (!searchHistory) {
        const newSearch = new SearchHistories({
          user: req.user._id,
          histories: [result],
        });

        await newSearch.save();
      } else {
        searchHistory.histories = searchHistory.histories.filter(
          (history) => history._id.toString() !== result._id.toString()
        );

        if (searchHistory.histories.length >= 20) {
          searchHistory.histories.pop();
        }

        searchHistory.histories.unshift(result);

        await searchHistory.save();
      }

      const reponse = await SearchHistories.findOne({
        user: req.user._id,
      });

      res.json({
        msg: "Cập nhật lịch sử tìm kiếm thành công!",
        data: reponse.histories,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteSearchHistory: async (req, res) => {
    const { id } = req.params;

    try {
      const searchHistory = await SearchHistories.findOne({
        user: req.user._id,
      });

      if (!searchHistory) {
        return res.status(400).json({ msg: "Lịch sử tìm kiếm không tồn tại." });
      }

      searchHistory.histories = searchHistory.histories.filter(
        (history) => history._id.toString() !== id.toString()
      );

      await searchHistory.save();

      return res.json({
        msg: "Xóa lịch sử tìm kiếm thành công!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteAllSearchHistory: async (req, res) => {
    try {
      await SearchHistories.findOneAndDelete({
        user: req.user._id,
      });

      return res.json({
        msg: "Xóa tất cả lịch sử tìm kiếm thành công!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
