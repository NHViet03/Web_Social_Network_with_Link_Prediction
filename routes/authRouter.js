const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");
const auth = require("../middleware/auth");

router.post("/register", authCtrl.register);
router.post("/verifyOTP", authCtrl.verifyOTP);
router.post("/resendOTP", authCtrl.resendOTP);
router.post("/forgotpassword", authCtrl.forgotpassword);
router.post("/forgotpasswordverifyotp", authCtrl.forgotpasswordverifyotp);
router.patch(
  "/forgotpasswordchangepassword",
  authCtrl.forgotpasswordchangepassword
);
router.post("/login", authCtrl.login);
router.post("/logout", authCtrl.logout);
router.post("/refresh_token", authCtrl.generateAccessToken);
router.patch("/changepassword", authCtrl.changepassword);

router.post(
  "/block-device-access/:userId/:deviceId",
  auth,
  authCtrl.blockDeviceAccess
);

module.exports = router;
