import React from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

const UserCard = ({ avatar, username, fullname, size, follow }) => {
  return (
    <div className=" d-flex justify-content-between align-items-center userCard">
      <Link to={`/profile/abc`} className="d-flex align-items-center">
        <Avatar src={avatar} size={size ? size : "avatar-sm"} />
        <div
          className="userCard-content"
          style={{ marginLeft: size ? "16px" : "" }}
        >
          <h6 className="userCard-username">{username}</h6>
          <small className="userCard-fullname">{fullname}</small>
        </div>
      </Link>
      <div>
        {follow && (
          <span
            style={{
              fontSize: "14px",
              color: "var(--primary-color)",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Theo dõi
          </span>
        )}
      </div>
    </div>
  );
};

export default UserCard;
