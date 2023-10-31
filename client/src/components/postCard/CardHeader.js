import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../Avatar";

const CardHeader = ({ user }) => {
  return (
    <div className="d-flex justify-content-between align-items-center card_header">
      <Link
        className="d-flex align-items-center card_header-content"
        to={`/profile/${user._id}`}
      >
        <Avatar src={user.avatar} size="avatar-sm" />
        <h6 className="my-0">{user.username}</h6>
        <span className="material-icons">fiber_manual_record</span>
        <small>1 ngày</small>
      </Link>
      <div className="nav-item dropdown">
        <span
          className="material-icons"
          id="morelink"
          data-bs-toggle="dropdown"
          style={{cursor:"pointer"}}
        >
          more_horiz
        </span>
        <div className="dropdown-menu">
          <div
            className="dropdown-item"
            style={{ color: "var(--primary-color)" }}
          >
            <span className="material-icons">report_problem</span>
            <span>Báo cáo</span>
          </div>
          <div className="dropdown-item">
            <span className="material-icons">content_copy</span>
            <span>Sao chép liên kết</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
