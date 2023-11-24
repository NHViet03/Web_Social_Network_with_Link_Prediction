import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import Avatar from "../Avatar";
import LikeButton from "../LikeButton";

const CardComment = ({ commentProp, handleClose, handleDeleteComment }) => {
  const auth = useSelector((state) => state.auth);
  const [comment, setComment] = useState(false);
  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    setComment(commentProp);
  }, [commentProp]);


  const handleLike = () => {
    setIsLike(true);
    setComment({
      ...comment,
      likes:[...comment.likes,auth.user._id]
    })
  };

  const handleUnLike = () => {
    setIsLike(false);
    setComment({
      ...comment,
      likes:comment.likes.filter(like=>like !== auth.user._id)
    })
  };

  const handleClickUser = () => {
    if (handleClose) handleClose();
  };

  return (
    <div className="mb-3 card_comment">
      {comment && (
        <>
          <Link to={`/profile/${comment.user._id}`} onClick={handleClickUser}>
            <Avatar src={comment.user.avatar} size="avatar-sm" />
          </Link>

          <div className="card_comment-content">
            <div className="card_comment-content-user">
              <Link
                to={`/profile/${comment.user._id}`}
                onClick={handleClickUser}
              >
                <span className="card_comment-content-user-username">
                  {comment.user.username}
                </span>
              </Link>

              <span className="card_comment-content-user-comment">
                {" "}
                {comment.content}
              </span>
            </div>
            <div className="d-flex card_comment-menu">
              <span className="card_comment-menu-text">
                {comment.createdAt
                  ? moment(comment.createdAt).fromNow()
                  : "1 ngày trước"}
              </span>

              {comment.likes.length > 0 && (
                <span
                  className="ms-3 card_comment-menu-text"
                  style={{ fontWeight: "500" }}
                >
                  {comment.likes.length} lượt thích
                </span>
              )}

              {auth.user._id === comment.user._id && (
                <div className="ms-3 nav-item dropdown">
                  <span
                    className="material-icons"
                    id="morelink"
                    data-bs-toggle="dropdown"
                    style={{ cursor: "pointer" }}
                  >
                    more_horiz
                  </span>
                  <div className="dropdown-menu" style={{ minWidth: "100px" }}>
                    <div
                      className="dropdown-item d-flex align-items-center"
                      style={{
                        color: "var(--primary-color)",
                        cursor: "pointer",
                      }}
                      onClick={handleDeleteComment}
                    >
                      <span className="material-icons">delete_outline</span>
                      <span>Xoá</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <LikeButton
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
        </>
      )}
    </div>
  );
};

export default CardComment;
