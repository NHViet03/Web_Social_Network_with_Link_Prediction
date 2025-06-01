import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Compressor from "compressorjs";

import CardComment from "./CardComment";
import LikeButton from "../LikeButton";
import BookMarkButton from "./BookMarkButton";
import Avatar from "../Avatar";

import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { useSelector, useDispatch } from "react-redux";
import {
  likePost,
  unLikePost,
  unSavePost,
  savePost,
} from "../../redux/actions/postAction";
import {
  createComment,
  generateNewComments,
} from "../../redux/actions/commentAction";

const CardFooterDetail = ({ post, setPost, explore, handleClose }) => {
  const [comment, setComment] = useState("");
  const [reply, setReply] = useState({});
  const [image, setImage] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [loadSave, setLoadSave] = useState(false);
  const [loadComment, setLoadComment] = useState(false);

  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  const commentRef = useRef();

  useEffect(() => {
    if (post.likes.find((like) => like === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [auth.user._id, post]);

  useEffect(() => {
    if (auth.user.saved.find((save) => save._id === post._id)) {
      setIsBookmark(true);
    } else {
      setIsBookmark(false);
    }
  }, [auth.user._id, auth.user.saved, post]);

  const handleShowSharePost = () => {
    dispatch({ type: GLOBAL_TYPES.SHARE_POST, payload: post });
  };

  const handleLike = async () => {
    if (loadLike) return;
    setLoadLike(true);
    setIsLike(true);
    await dispatch(likePost({ post, auth, explore, socket }));
    setLoadLike(false);
  };
  const handleUnLike = async () => {
    if (loadLike) return;
    setLoadLike(true);
    setIsLike(false);
    await dispatch(unLikePost({ post, auth, explore, socket }));
    setLoadLike(false);
  };

  const handleBookmark = async () => {
    if (loadSave) return;
    setLoadSave(true);
    setIsBookmark(true);
    await dispatch(savePost({ post, auth }));
    setLoadSave(false);
  };

  const handleUnBookmark = async () => {
    if (loadSave) return;
    setLoadSave(true);
    setIsBookmark(false);
    await dispatch(unSavePost({ post, auth }));
    setLoadSave(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if ((!comment.trim() && image == null) || loadComment) return;
    setLoadComment(true);
    setComment("");
    setReply({});
    setImage(null);
    setShowEmoji(false);

    const trimmedComment = comment.replace(/^@\S+\s*/, "");

    const newComment = {
      content: trimmedComment,
      user: auth.user,
      likes: [],
      postId: post._id,
      postUserId: post.user._id,
      createdAt: new Date().toISOString(),
      replyCommentId: reply?.commentId,
      replyUser: reply?.user,
      replies: [],
      image: image,
    };

    if (setPost) {
      const newComments = generateNewComments(post, newComment);

      setPost({
        ...post,
        comments: [...newComments],
      });
    }

    const res = await dispatch(
      createComment({ post, newComment, auth, explore, socket })
    );
    setLoadComment(false);

    if (setPost) {
      setPost(res);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setComment(comment + emoji.native);
    commentRef.current.focus();
  };

  const generateHashtags = () => {
    const hashtags = post.hashtags.map((hashtag, index) => {
      return (
        <Link
          key={index}
          className="hashtag"
          to={`/explore/hashtags/${hashtag}`}
        >
          #{hashtag}
        </Link>
      );
    });
    return hashtags;
  };

  const handleClickReply = (data) => {
    if (data.user == null || data.user === undefined) return;

    setReply({
      commentId: data._id,
      user: {
        userId: data.user?._id,
        username: data.user.username,
      },
    });

    setComment(`@${data.user.username} `);

    commentRef.current.focus();
  };

  const handleOnChangeComment = (e) => {
    setComment(e.target.value);

    if (e.target.value.trim() === "") {
      setReply(null);
    }
  };

  const handleChangeImages = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: "Vui lòng upload file đúng định dạng" },
      });
    }

    if (file.size > 1024 * 1024 * 5) {
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: "Vui lòng upload file có kích thước dưới 5 MB" },
      });
    }

    new Compressor(file, {
      quality: 0.8, // Chất lượng từ 0 đến 1 (0.6 = 60% chất lượng)
      maxWidth: 400, // Chiều rộng tối đa
      maxHeight: 300, // Chiều cao tối đa
      mimeType: "image/jpeg", // Định dạng đầu ra
      success(result) {
        setImage(result);
      },
      error(err) {
        console.error(err.message);
        setImage(file);
      },
    });
  };

  return (
    <div className="mt-3 pt-3 pb-1 flex-fill d-flex flex-column card_footer">
      {post && (
        <>
          <div className="card_footer-comments mb-3">
            <div className="mb-3 card_comment">
              <Link to={`/profile/${post.user._id}`} onClick={handleClose}>
                <Avatar src={post.user.avatar} size="avatar-sm" />
              </Link>

              <div className="card_comment-content">
                <div className="card_comment-content-user">
                  <Link to={`/profile/${post.user._id}`} onClick={handleClose}>
                    <span className="card_comment-content-user-username">
                      {post.user.username}
                    </span>
                  </Link>

                  <span className="card_comment-content-user-comment">
                    {" "}
                    {post.content}
                  </span>
                </div>
                {post.hashtags?.length > 0 && (
                  <div
                    style={{
                      color: "rgb(65, 80, 247)",
                      display: "flex",
                      gap: "6px",
                    }}
                  >
                    {generateHashtags()}
                  </div>
                )}
              </div>
            </div>

            {post.comments.length === 0 && (
              <div className="d-flex align-items-center justify-content-center flex-column flex-fill">
                <h4>Chưa có bình luận nào.</h4>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-color)",
                  }}
                >
                  Bắt đầu trò chuyện.
                </p>
              </div>
            )}

            {post.comments.map((comment, index) => (
              <CardComment
                key={index}
                post={post}
                setPost={setPost ? setPost : false}
                comment={comment}
                loadComment={!comment._id ? loadComment : false}
                explore={explore}
                handleClose={handleClose}
                handleClickReply={handleClickReply}
              />
            ))}
          </div>
          <div className="px-3 card_footer-icons">
            <div>
              <LikeButton
                isLike={isLike}
                handleLike={handleLike}
                handleUnLike={handleUnLike}
              />
              <span className="fa-regular fa-comment" />
              <span
                className="fa-regular fa-paper-plane"
                onClick={handleShowSharePost}
              />
            </div>
            <BookMarkButton
              isBookmark={isBookmark}
              handleBookmark={handleBookmark}
              handleUnBookmark={handleUnBookmark}
            />
          </div>
          <p
            className="my-2 px-3"
            style={{ fontWeight: "600", fontSize: "14px" }}
          >
            {post.likes.length} lượt thích
          </p>

          <form onSubmit={handleComment} className="px-3 form-comment">
            <div
              className="d-flex align-items-center"
              style={{
                gap: "12px",
              }}
            >
              <div className="form-emoji">
                <i
                  className="fa-regular fa-face-grin"
                  onClick={() => setShowEmoji(!showEmoji)}
                />

                {showEmoji && (
                  <div className="form-emoji-picker">
                    <Picker
                      data={data}
                      previewPosition="none"
                      searchPosition="none"
                      theme="light"
                      set="native"
                      locale="vi"
                      perLine="7"
                      maxFrequentRows={14}
                      emojiSize={28}
                      navPosition="bottom"
                      onEmojiSelect={handleEmojiSelect}
                    />
                  </div>
                )}
              </div>

              <div>
                <input
                  type="file"
                  name="file"
                  id="file"
                  multiple={false}
                  accept="image/*"
                  style={{
                    display: "none",
                  }}
                  onChange={handleChangeImages}
                />
                <label htmlFor="file" className="select_image_btn">
                  <i
                    className="fa-solid fa-camera"
                    style={{
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  ></i>
                </label>
              </div>
            </div>

            <input
              ref={commentRef}
              className="form-control"
              value={comment}
              onChange={handleOnChangeComment}
              placeholder="Thêm bình luận..."
            />
            <button
              className="btn pe-0 btn-comment"
              type="submit"
              disabled={comment.length < 1 && image == null ? true : false}
              style={{ color: "var(--primary-color)" }}
            >
              Đăng
            </button>
          </form>
          {image && (
            <div
              style={{
                width: "80px",
                height: "60px",
                position: "relative",
                padding: "2px",
                backgroundImage:
                  "linear-gradient(to right bottom, #feda75, #fa7e1e, #d62976, #962fbf)",
                margin: "0 16px",
              }}
            >
              <img
                src={URL.createObjectURL(image)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  padding: "1px",
                  backgroundColor: "#fff",
                }}
                alt="comment"
              />
              <span
                className="material-icons"
                style={{
                  position: "absolute",
                  top: "0",
                  right: "-30px",
                  color: "#000",
                  fontSize: "20px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  border: "1px solid #000",
                }}
                onClick={() => setImage(null)}
              >
                close
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CardFooterDetail;
