const Notifies = require("../models/notifyModel");

const notifyCtrl = {
  createNotify: async (req, res) => {
    try {
      const { id, recipients, url, content, image } = req.body;

      if (recipients.includes(req.user._id.toString())) {
        return;
      }

      const notify = new Notifies({
        id,
        user: req.user._id,
        recipients,
        url,
        content,
        image,
      });

      await notify.save();

      res.json({
        msg: "Tạo thông báo thành công!",
        notify: {
          ...notify._doc,
          user: {
            _id: req.user._id,
            username: req.user.username,
            avatar: req.user.avatar,
            followers: req.user.followers,
            following: req.user.following,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  removeNotify: async (req, res) => {
    try {
      const notify = await Notifies.findOneAndDelete({
        id: req.params.id,
        url: req.query.url,
      });

      return res.json({ notify });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getNotifies: async (req, res) => {
    try {
      const notifies = await Notifies.find({
        recipients: req.user._id,
      })
        .sort("-createdAt")
        .populate("user", "avatar username followers following");

      return res.json({ notifies });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  readNotify: async (req, res) => {
    try {
      await Notifies.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          isRead: true,
        }
      );

      return res.status(200).json({ msg: "Đã đọc thông báo" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteAllNotifies: async (req, res) => {
    try {
      const notifies = await Notifies.find({
        recipients: req.user._id,
      });

      if (notifies.length === 0) {
        return res.status(400).json({ msg: "Không có thông báo nào" });
      }

      notifies.forEach((item) => {
        item.recipients = item.recipients.filter(
          (recipient) => recipient.toString() !== req.user._id.toString()
        );

        if (item.recipients.length === 0) {
          item.remove();
        } else {
          item.save();
        }
      });

      return res.status(200).json({ msg: "Đã xóa tất cả thông báo" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = notifyCtrl;
