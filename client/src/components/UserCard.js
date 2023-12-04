import React from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";

const UserCard = ({user, size, follow }) => {
  const {auth} = useSelector(state => state)
  return (
    <div className=" d-flex justify-content-between align-items-center userCard">
      <Link to={`/profile/${auth.user._id}`} className="d-flex align-items-center">
        <Avatar src={user.avatar} size={size ? size : "avatar-sm"} />
        <div
          className="userCard-content"
          style={{ marginLeft: size ? "16px" : "" }}
        >
          <h6 className="userCard-username">{user.username}</h6>
          <small className="userCard-fullname">{user.fullname}</small>
        </div>
      </Link>
      {follow && (
        <div>
          <span
            className="text_primary"
            style={{
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Theo dõi
          </span>
        </div>
      )}
    </div>
  );
};

export default UserCard;
