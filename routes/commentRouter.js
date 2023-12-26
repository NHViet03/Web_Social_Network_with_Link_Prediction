const router = require("express").Router();
const comment = require("../controllers/commentCtrl");
const auth = require("../middleware/auth");

router.post("/create_comment", auth, comment.createComment);

router.patch("/like_comment/:id", auth, comment.likeComment);
router.patch("/unlike_comment/:id", auth, comment.unLikeComment);

router.delete("/comment/:id/:postId", auth, comment.deleteComment);

module.exports = router;
