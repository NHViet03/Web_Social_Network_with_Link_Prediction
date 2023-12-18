import React from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

const UserCard = ({children, user, size, follow, setShowFollowers , setShowFollowing, headerMessage}) => {
  const handleCloseAll = () => {
     if (setShowFollowers)  setShowFollowers(false)
     if (setShowFollowing) setShowFollowing(false)
  }
  return (
    <div className={`d-flex justify-content-between align-items-center userCard w-100`}>
      <Link to={`/profile/${user._id}`} className={`d-flex align-items-center`} onClick={handleCloseAll}>
        <Avatar src={user.avatar} size={size ? size : "avatar-sm"} />
        <div
          className="userCard-content"
          style={{ marginLeft: size ? "16px" : "" }}
        >
          <h6 className="userCard-username">{user.username}</h6>
         
          <small className="userCard-fullname">
          {
             headerMessage ? user.fullname : (user.text || user.media ? user.text : user.fullname)
          }

          </small>
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
      { children}
    </div>
  );
};

export default UserCard;
