import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import moment from "moment";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import CardComment from "./CardComment";
import LikeButton from "../LikeButton";
import BookMarkButton from "./BookMarkButton";
import Avatar from "../Avatar";

const CardFooterDetail = ({ post, handleClose }) => {
  const [postModal, setPostModal] = useState(false);
  const [comment, setComment] = useState("");
  const [isLike, setIsLike] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const  auth  = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const commentRef = useRef();

  useEffect(() => {
    // Fake API
    setPostModal(post);
  }, [post]);

  const handleShowPostDetail = () => {
   
      dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: post });
    
  };
  const handleShowSharePost = () => {
    
      dispatch({ type: GLOBAL_TYPES.SHARE_POST, payload: post });
    
  };

  const handleLike = () => {
    setIsLike(true);
    setPostModal({
      ...postModal,
      likes: [...postModal.likes, auth._id],
    });
  };
  const handleUnLike = () => {
    setIsLike(false);
    setPostModal({
      ...postModal,
      likes: postModal.likes.filter((like) => like !== auth._id),
    });
  };

  const handleBookmark = () => {
    setIsBookmark(true);
  };

  const handleUnBookmark = () => {
    setIsBookmark(false);
  };

  const handleComment = (e) => {
    e.preventDefault();
    const newComment = {
      content: comment,
      user: auth,
      likes: [],
      createdAt: new Date().toISOString(),
    };
    setPostModal({
      ...postModal,
      comments: [newComment, ...postModal.comments],
    });
    setComment("");
    setShowEmoji(false);
  };

  const handleDeleteComment = () => {
    setPostModal({
      ...postModal,
      comments: postModal.comments.filter(
        (comment) => comment.user._id !== auth._id
      ),
    });
  };

  const handleEmojiSelect = (emoji) => {
    setComment(comment + emoji.native);
    commentRef.current.focus();
  };

  return (
    <div className="mt-3 pt-3 pb-1 px-2  flex-fill d-flex flex-column card_footer">
      {postModal && (
        <>
          <div className="card_footer-comments mb-3">
            <div className="mb-3 card_comment">
              <Link to={`/profile/${postModal.user._id}`} onClick={handleClose}>
                <Avatar src={postModal.user.avatar} size="avatar-sm" />
              </Link>

              <div className="card_comment-content">
                <div className="card_comment-content-user">
                  <Link
                    to={`/profile/${postModal.user._id}`}
                    onClick={handleClose}
                  >
                    <span className="card_comment-content-user-username">
                      {postModal.user.username}
                    </span>
                  </Link>

                  <span className="card_comment-content-user-comment">
                    {" "}
                    {postModal.content}
                  </span>
                </div>
                <div className="d-flex">
                  <span className="card_comment-menu-text">
                    {postModal.createdAt
                      ? moment(new Date()).fromNow()
                      : "1 ngày trước"}
                  </span>
                </div>
              </div>
            </div>

            {postModal.comments.map((comment, index) => (
              <CardComment
                key={index}
                commentProp={comment}
                handleClose={handleClose}
                handleDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
          <div className="card_footer-icons">
            <div>
              <LikeButton
                isLike={isLike}
                handleLike={handleLike}
                handleUnLike={handleUnLike}
              />
              <span
                className="fa-regular fa-comment"
                onClick={handleShowPostDetail}
              />
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
          <p className="my-2" style={{ fontWeight: "600", fontSize: "14px" }}>
            {postModal.likes.length} lượt thích
          </p>
          <form onSubmit={handleComment} className="form-comment">
            <div className="form-comment-emoji">
              <i
                className="fa-regular fa-face-grin"
                onClick={() => setShowEmoji(!showEmoji)}
              />

              {showEmoji && (
                <div className="form-comment-emoji-picker">
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
                    className="abc"
                  />
                </div>
              )}
            </div>
            <input
              ref={commentRef}
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Thêm bình luận..."
            />
            <button
              className="btn btn-comment"
              type="submit"
              disabled={comment.length < 1 ? true : false}
              style={{ color: "var(--primary-color)" }}
            >
              Đăng
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CardFooterDetail;
