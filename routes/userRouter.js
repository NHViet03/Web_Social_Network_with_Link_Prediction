const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

router.get("/search", userCtrl.searchUser);
router.get("/user/:id", auth, userCtrl.getUser);
router.patch("/user", auth, userCtrl.updateUser);
router.patch("/user/:id/follow", auth, userCtrl.follow);
router.patch("/user/:id/unfollow", auth, userCtrl.unfollow);

router.get("/suggestions", auth, userCtrl.getSuggestions);

router.get("/search_history", auth, userCtrl.getSearchHistories);
router.post("/search_history/update", auth, userCtrl.updateSearchHistory);
router.patch("/search_history/:id", auth, userCtrl.deleteSearchHistory);
router.delete("/search_history", auth, userCtrl.deleteAllSearchHistory);

module.exports = router;
