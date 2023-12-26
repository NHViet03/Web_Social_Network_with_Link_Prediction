const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");
const auth = require("../middleware/auth");

router.post("/create_post", auth, postCtrl.createPost);

router.get("/posts", auth, postCtrl.getPosts);

router
  .route("/post/:id")
  .get(auth, postCtrl.getPost)
  .patch(auth, postCtrl.updatePost)
  .delete(auth, postCtrl.deletePost);

router.patch("/like_post/:id", auth, postCtrl.likePost);
router.patch("/unlike_post/:id", auth, postCtrl.unLikePost);

router.get("/explore_posts", auth, postCtrl.getExplorePosts);
router.get("/user_posts/:id", auth, postCtrl.getUserPosts);

router.patch("/save_post/:id", auth, postCtrl.savePost);
router.patch("/unsave_post/:id", auth, postCtrl.unSavePost);
router.get("/getSavePost", auth, postCtrl.getSavePosts);

router.post("/report_post", auth, postCtrl.reportPost);

module.exports = router;
