const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl");
const auth = require("../middleware/auth");

router.get("/home_info_cards/:interval", auth, adminCtrl.getHomeInfoCards);
router.get("/top_5_users", auth, adminCtrl.getTop5Users);
router.get("/admin/user/:id", auth, adminCtrl.getUserDetail);

module.exports = router;
