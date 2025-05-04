const Users = require("../models/userModel");

const userCtrl = {
  searchUser: async (req, res) => {
    try {
      const mainUserId = req.query.mesagechatbox
      const users = await Users.find({
        username: { $regex: req.query.username, $options: "i" }, 
        _id: { $ne: mainUserId }, 
      })
        .limit(10)
        .select("fullname username avatar");

      res.json({ users });
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
      const { avatar,fullname, username, story, gender, birthday, website, email } = req.body;
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
          $match: { _id: { $nin: exceptUsers },role: "user" },
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
     const user = await Users.find({_id : req.params.id, followers: req.user._id})
      if(user.length > 0) return res.status(400).json({msg: "Bạn đã theo dõi người dùng này."})

      await Users.findOneAndUpdate({_id: req.params.id},{
        $push: {followers:  req.user._id}
      }, {new: true});

      await Users.findOneAndUpdate({_id: req.user._id},{
        $push: {following:  req.params.id}
      }, {new: true});

      res.json({msg: "Đã theo dõi!"})
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      await Users.findOneAndUpdate({_id: req.params.id},{
        $pull: {followers:  req.user._id}
      }, {new: true});

      await Users.findOneAndUpdate({_id: req.user._id},{
        $pull: {following:  req.params.id}
      }, {new: true});

      res.json({msg: "Đã hủy theo dõi!"})
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = userCtrl;
