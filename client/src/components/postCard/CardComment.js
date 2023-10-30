import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../Avatar";

const CardComment = ({ user, comment, handleClose }) => {
  const handleClickUser = () => {
    if (handleClose) handleClose();
  };
  return (
    <div className="mb-3 card_comment">
      <Link to={`/profile/${user._id}`} onClick={handleClickUser}>
        <Avatar src={user.avatar} size="avatar-sm" />
      </Link>

      <div className="card_comment-content">
        <div className="card_comment-content-user">
          <Link to={`/profile/${user._id}`} onClick={handleClickUser}>
            <span className="card_comment-content-user-username">
              {user.username}
            </span>
          </Link>

          <span className="card_comment-content-user-comment"> {comment}</span>
        </div>
        <span className="card_comment-content-time">1 giờ trước</span>
      </div>
    </div>
  );
};

export default CardComment;
