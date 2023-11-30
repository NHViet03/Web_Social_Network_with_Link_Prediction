const Users = require("../models/userModel");

const userCtrl = {
  getSuggestions: async (req, res) => {
    try {
      const exceptUsers = [...req.user.following, req.user._id];
      const num = 5;

      const users = await Users.aggregate([
        {
          $match: { _id: { $nin: exceptUsers } },
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
};

module.exports = userCtrl;
