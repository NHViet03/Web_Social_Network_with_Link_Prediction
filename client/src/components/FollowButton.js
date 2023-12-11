import React, { useState, useEffect } from "react";
import { useSelector, useDispatch} from "react-redux";
import { follow, unfollow } from "../redux/actions/profileAction";
const FollowButton = ({user}) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const { theme , auth, profile} = useSelector((state) => state);
  const dispatch = useDispatch();
  const handleFollow = () => {
    setIsFollowed(true);
    dispatch(follow ({users: profile.users, user, auth}))
  };

  const handleUnFollow = () => {
    setIsFollowed(false);
    dispatch(unfollow ({users: profile.users, user, auth}))
    
  };
  useEffect(() => {
    if(auth.user.following.find(item => item._id === user._id)){
      setIsFollowed(true)
    }
  },[auth.user.following, user._id])

  return (
    <div className={`follow_btn ${isFollowed ? "" : "primary"}`} style={{filter:  theme ? 'invert(1)' :'invert(0)'}}>
      {isFollowed ? (
        <span onClick={handleUnFollow}>Đang theo dõi</span>
      ) : (
        <span onClick={handleFollow}>Theo dõi</span>
      )}
    </div>
  );
};

export default FollowButton;
