const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl");
const auth = require("../middleware/auth");

router.get("/home_info_cards/:interval", auth, adminCtrl.getHomeInfoCards);
router.get("/top_5_users", auth, adminCtrl.getTop5Users);

router.get("/admin/users",  adminCtrl.getUsers);
router.get("/admin/user/:id", auth, adminCtrl.getUserDetail);

router.get("/admin/posts", auth, adminCtrl.getPosts);
router.get("/admin/post/:id",auth, adminCtrl.getDetailPost);

router.post("/admin/send_mail",auth, adminCtrl.sendMail);

module.exports = router;
