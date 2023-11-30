const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");
const auth = require("../middleware/auth");

router.post("/create_post", auth, postCtrl.createPost);

router.get("/posts", auth, postCtrl.getPosts);

router
  .route("/post/:id")
  .patch(auth, postCtrl.updatePost)
  .delete(auth, postCtrl.deletePost);

router.patch("/like_post/:id",auth,postCtrl.likePost);
router.patch("/unlike_post/:id",auth,postCtrl.unLikePost);


module.exports = router;
