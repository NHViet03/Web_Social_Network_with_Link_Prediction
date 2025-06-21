const router = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl");
const auth = require("../middleware/auth");

router.get("/home_info_cards/:interval", adminCtrl.getHomeInfoCards);
router.get("/statistic", adminCtrl.getStatistic);
router.get("/top_5_users", adminCtrl.getTop5Users);

router.get("/admin/users", adminCtrl.getUsers);
router.get("/admin/user/:id", adminCtrl.getUserDetail);

router.get("/admin/posts", adminCtrl.getPosts);
router.get("/admin/post/:id", adminCtrl.getDetailPost);
router.put("/admin/post/:id/restore", adminCtrl.restorePost);

router.post("/admin/send_mail", adminCtrl.sendMail);

router.get("/admin/reports", adminCtrl.getReports);
router.get("/admin/reports/:id", adminCtrl.getReportDetail);
router.patch("/admin/report/:id", adminCtrl.updateReport);
router.delete("/admin/report/:id", adminCtrl.deleteReport);

module.exports = router;
