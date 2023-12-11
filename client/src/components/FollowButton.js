import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { follow, unfollow } from "../redux/actions/profileAction";

const FollowButton = ({ user }) => {
  const { theme, auth, profile, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (auth.user.following.find((item) => item._id === user._id)) {
      setIsFollowed(true);
    }
  }, [auth.user.following, user._id]);

  const handleFollow = (e) => {
    e.stopPropagation();
    setIsFollowed(true);
    dispatch(follow({ users: profile.users, user, auth, socket }));
  };

  const handleUnFollow = (e) => {
    e.stopPropagation();
    setIsFollowed(false);
    dispatch(unfollow({ users: profile.users, user, auth, socket }));
  };

  return (
    <div
      className={`follow_btn ${isFollowed ? "" : "primary"}`}
      style={{ filter: theme ? "invert(1)" : "invert(0)" }}
    >
      {isFollowed ? (
        <span onClick={handleUnFollow}>Đang theo dõi</span>
      ) : (
        <span onClick={handleFollow}>Theo dõi</span>
      )}
    </div>
  );
};

export default FollowButton;
