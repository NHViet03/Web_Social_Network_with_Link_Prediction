import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Avatar from "../Avatar";
import LikeButton from "../LikeButton";

import { useSelector, useDispatch } from "react-redux";
import {
  likeComment,
  unLikeComment,
  deleteComment,
} from "../../redux/actions/commentAction";

const CardCommentReply = ({
  post,
  setPost,
  comment,
  handleClose,
  explore,
  handleClickReply,
  parentCommentId,
}) => {
  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    if (comment.likes.find((like) => like === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [auth.user._id, comment.likes]);

  const handleLike = async () => {
    if (loadLike) return;
    setLoadLike(true);
    setIsLike(true);
    await dispatch(likeComment({ post, comment, auth, explore, socket }));
    setLoadLike(false);
  };
  const handleUnLike = async () => {
    if (loadLike) return;
    setLoadLike(true);
    setIsLike(false);
    await dispatch(unLikeComment({ post, comment, auth, explore, socket }));
    setLoadLike(false);
  };

  const handleDeleteComment = async () => {
    if (post.user._id === auth.user._id || comment.user._id === auth.user._id) {
      const res = await dispatch(
        deleteComment({ post, comment, auth, explore, socket })
      );

      if (setPost) {
        setPost(res);
      }
    }
  };

  const handleClickUser = () => {
    if (handleClose) handleClose();
  };

  return (
    <div
      className="mb-3 card_comment"
      style={{
        width: "100%",
        padding: 0,
      }}
    >
      <Link to={`/profile/${comment.user._id}`} onClick={handleClickUser}>
        <Avatar src={comment.user.avatar} size="avatar-sm" />
      </Link>
      <div className="card_comment-content">
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div className="card_comment-content-user">
              <Link
                to={`/profile/${comment.user._id}`}
                onClick={handleClickUser}
                style={{
                  marginRight: "4px",
                }}
              >
                <span className="card_comment-content-user-username">
                  {comment.user.username}
                </span>
              </Link>

              <span>
                {comment.replyUser && (
                  <Link
                    to={`/profile/${comment.replyUser.userId}`}
                    style={{
                      color: "rgb(65, 80, 247)",
                    }}
                  >
                    {`@${comment.replyUser.username} `}
                  </Link>
                )}
              </span>
              <span className="card_comment-content-user-comment">
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

              <span
                className="ms-3 card_comment-menu-text"
                style={{ fontWeight: "500", cursor: "pointer" }}
                onClick={() =>
                  handleClickReply({
                    _id: parentCommentId,
                    user: comment.user,
                  })
                }
              >
                Trả lời
              </span>

              {(auth.user._id === comment.user._id ||
                post.user._id === auth.user._id) && (
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

            {comment.replies?.length > 0 && (
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    border: 0,
                    borderBottom: "1px solid var(--text-color)",
                    display: "inline-block",
                    width: "24px",
                    verticalAlign: "middle",
                    marginRight: "16px",
                  }}
                />
                <span
                  className="card_comment-menu-text"
                  style={{
                    fontWeight: 500,
                  }}
                >
                  Xem câu trả lời ({comment.replies.length})
                </span>
              </div>
            )}
          </div>
          <LikeButton
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
        </div>
      </div>
    </div>
  );
};

export default CardCommentReply;
