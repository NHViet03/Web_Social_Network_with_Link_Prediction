const Users = require("../models/userModel");
const bycrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ipaddr = require("ipaddr.js");

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const authCtrl = {
  register: async (req, res) => {
    try {
      const {
        fullname,
        username,
        email,
        password,
        birthday,
        avatar,
        isFacebook,
      } = req.body;
      let newUserName = username.toLowerCase().replace(/ /g, "");

      const user_name = await Users.findOne({ username: newUserName });
      if (user_name)
        return res.status(400).json({ message: "Người dùng này đã tồn tại." });

      const user_email = await Users.findOne({ email: email });
      if (user_email)
        return res.status(400).json({ message: "Email này đã tồn tại." });

      if (!isFacebook && password.length < 6)
        return res
          .status(400)
          .json({ message: "Mật khẩu phải gồm ít nhất 6 kí tự." });

      let passwordHash;

      if (!isFacebook) {
        passwordHash = await bycrypt.hash(password, 12);
      }

      // Create OTP for email verification 5 numbers
      const emailOtp = Math.floor(100000 + Math.random() * 900000);

      const newUser = new Users({
        fullname,
        username: newUserName,
        email,
        password: passwordHash,
        birthday,
        otpcode: emailOtp,
        avatar,
      });

      await newUser.save();
      res.json({
        msg: "Đăng ký thành công. Vui lòng kiểm tra email của bạn.",
        userID: newUser._id,
      });

      // Gửi email trong nền
      setImmediate(async () => {
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
            to: email,
            subject: "Xác thực tài khoản Dreamers",
            html: `
                    <h2>Xác thực tài khoản Dreamers</h2>
                    <h3>Chào mừng bạn đến với Dreamers. Hãy xác thực tài khoản với username: ${newUserName}</h3>
                    <h3>Mã OTP của bạn là: ${emailOtp}</h3>
                    <p>Đây là email xác thực tài khoản Dreamers của bạn. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                `,
          };

          await transporter.sendMail(mailOptions);
          console.log("Email gửi thành công!");
        } catch (err) {
          console.error("Lỗi khi gửi email:", err);
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  verifyOTP: async (req, res) => {
    try {
      const { userID, otpcode } = req.body;

      // Get user by ID and OTP code
      const user = await Users.findOne({ _id: userID, otpcode: otpcode });
      if (!user) return res.status(400).json({ msg: "Mã OTP không đúng." });
      user.isVerify = true;
      await user.save();

      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 7 * 24 * 60 * 60 * 1000, // 30days
      });

      res.json({
        msg: "Đăng ký thành công",
        access_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotpasswordverifyotp: async (req, res) => {
    try {
      const { userID, otpcode } = req.body;

      // Get user by ID and OTP code
      const user = await Users.findOne({ _id: userID, otpcode: otpcode });
      if (!user) return res.status(400).json({ msg: "Mã OTP không đúng." });

      res.json({
        msg: "Xác thực thành công",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotpasswordchangepassword: async (req, res) => {
    try {
      const { userID, newPassword } = req.body;

      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ msg: "Mật khẩu mới phải nhiều hơn 6 kí tự" });

      const newPasswordHash = await bycrypt.hash(newPassword, 12);

      await Users.findOneAndUpdate(
        { _id: userID },
        {
          password: newPasswordHash,
        }
      );
      return res.json({ msg: "Thay đổi mật khẩu thành công." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resendOTP: async (req, res) => {
    try {
      const { userID } = req.body;
      // Get user by ID
      const user = await Users.findOne({ _id: userID });

      if (!user)
        return res.status(400).json({ msg: "Tài khoản không tồn tại." });

      const emailOtp = Math.floor(100000 + Math.random() * 900000);
      user.otpcode = emailOtp;
      await user.save();

      res.json({ msg: "Mã OTP đã được gửi đến email của bạn." });

      // Gửi email trong nền
      setImmediate(async () => {
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
            to: user.email,
            subject: "Xác thực tài khoản Dreamers",
            html: `
                    <h2>Xác thực tài khoản Dreamers</h2>
                    <h3>Chào mừng bạn đến với Dreamers. Hãy xác thực tài khoản với username: ${user.username}</h3>
                    <h3>Mã OTP của bạn là: ${emailOtp}</h3>
                    <p>Đây là email xác thực tài khoản Dreamers của bạn. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                `,
          };

          await transporter.sendMail(mailOptions);
          console.log("Email gửi thành công!");
        } catch (err) {
          console.error("Lỗi khi gửi email:", err);
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotpassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({
        email: email,
      });

      if (!user)
        return res.status(400).json({ msg: "Tài khoản không tồn tại." });

      // Create OTP for email verification 5 numbers
      const emailOtp = Math.floor(100000 + Math.random() * 900000);
      user.otpcode = emailOtp;
      await user.save();
      res.json({
        msg: "Mã OTP đã được gửi đến email của bạn.",
        userID: user._id,
      });

      // Gửi email trong nền
      setImmediate(async () => {
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
            to: user.email,
            subject: "Xác thực tài khoản Dreamers",
            html: `
              <h2>Xác thực quên mật khẩu tài khoản Dreamers</h2>
              <h3>Chào mừng bạn đến với Dreamers. Hãy xác thực quên mật khẩu tài khoản với username: ${user.username}</h3>
              <h3>Mã OTP của bạn là: ${emailOtp}</h3>
              <p>Đây là email xác thực tài khoản Dreamers của bạn. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
          `,
          };

          await transporter.sendMail(mailOptions);
          console.log("Email gửi thành công!");
        } catch (err) {
          console.error("Lỗi khi gửi email:", err);
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password, isFacebook, accessToken, devideInfo } = req.body;

      const user = await Users.findOne({ email: email })
        .populate(
          "followers following",
          "avatar username fullname followers following"
        )
        .populate("saved", "images likes comments");

      if (!user)
        return res.status(400).json({ msg: "Tài khoản không tồn tại" });

      if (isFacebook) {
        if (!accessToken)
          return res.status(400).json({ msg: "Access token không hợp lệ." });

        const response = await axios.get(
          `https://graph.facebook.com/debug_token`,
          {
            params: {
              input_token: accessToken,
              access_token: `${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`,
            },
          }
        );

        const data = response.data;

        if (!data.data.is_valid) {
          return res.status(401).json({ error: "Access token không hợp lệ." });
        }
      } else {
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: "Mật khẩu không đúng" });
      }

      if (!user.isVerify)
        return res
          .status(403)
          .json({ msg: "Vui lòng xác thực email.", userID: user._id });

      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 7 * 24 * 60 * 60 * 1000, // 30days
      });
 
      console.log(devideInfo);

      res.json({
        msg: "Đăng nhập thành công",
        access_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "Đăng xuất thành công" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now." });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) return res.status(400).json({ msg: "Please login now." });

          const user = await Users.findOne({ _id: result.id })
            .select("-password")
            .populate(
              "followers following",
              "avatar username fullname followers following"
            )
            .populate("saved", "images likes comments");
          if (!user)
            return res.status(400).json({ msg: "This does not exist." });

          const access_token = createAccessToken({ id: result.id });

          res.json({
            access_token,
            user,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  changepassword: async (req, res) => {
    try {
      const { password, newPassword } = req.body;
      const user = await Users.findById(req.body.user._id).select("password");
      const isMatch = await bycrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Mật khẩu hiện tại không đúng." });
      }

      const newPasswordHash = await bycrypt.hash(newPassword, 12);

      await Users.findOneAndUpdate(
        { _id: req.body.user._id },
        {
          password: newPasswordHash,
        }
      );
      return res.json({ msg: "Thay đổi mật khẩu thành công." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = authCtrl;
