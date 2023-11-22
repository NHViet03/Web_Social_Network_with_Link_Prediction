import React, { useState } from "react";

const FollowButton = () => {
  const [isFollowed, setIsFollowed] = useState(false);

  const handleFollow = () => {
    setIsFollowed(true);
  };

  const handleUnFollow = () => {
    setIsFollowed(false);
  };

  return (
    <div className={`follow_btn ${isFollowed ? "" : "primary"}`}>
      {isFollowed ? (
        <span onClick={handleUnFollow}>Đang theo dõi</span>
      ) : (
        <span onClick={handleFollow}>Theo dõi</span>
      )}
    </div>
  );
};

export default FollowButton;
