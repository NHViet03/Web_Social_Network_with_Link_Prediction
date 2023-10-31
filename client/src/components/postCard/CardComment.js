import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import Avatar from "../Avatar";

const CardComment = ({
  content,
  user,
  createdAt,
  handleClose,
  handleDeleteComment,
}) => {
  const { auth } = useSelector((state) => state);

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

          <span className="card_comment-content-user-comment"> {content}</span>
        </div>
        <div className="d-flex">
          <span className="card_comment-content-time">{createdAt ? moment(new Date()).fromNow() : '1 ngày trước'}</span>
          {auth._id === user._id && (
            <div className="ms-2 nav-item dropdown">
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
                  style={{ color: "var(--primary-color)", cursor: "pointer" }}
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
    </div>
  );
};

export default CardComment;
