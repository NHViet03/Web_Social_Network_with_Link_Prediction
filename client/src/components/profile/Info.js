import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Avatar from "../Avatar";
import EditProfile from "./EditProfile";
import FollowButton from "../FollowButton";
import Following from "./Following";
import Followers from "./Followers";
const Info = ({id, auth, profile, dispatch}) => {
  const { theme } = useSelector((state) => state);
  const [userData, setUserData] = useState([]);
  const [onEdit, setOnEdit] = useState(false);
  const [onSetting, setOnSetting] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [numberPost, setNumberPost] = useState(9);
  useEffect(() => {
    profile.posts.forEach((data) => {
      if (data._id === id) {
        setNumberPost(data.result);
      }
    });
  },[profile.posts, id])
  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {

      const newData = profile.users.filter((user) => user._id === id);
      setUserData(newData);
    }
  }, [id, auth, dispatch, profile.users]);
  
  useEffect(() => {
    if (showFollowers || showFollowing || onEdit || onSetting ) {
      dispatch({ type: "ADD_MODAL", payload: true });
    }else{
      dispatch({ type: "ADD_MODAL", payload: false });
    }
  },[showFollowers, showFollowing, onEdit, onSetting, dispatch])

  return (
    <div className="info">
      {userData.map((user) => (
        <div className="info_container" key={user._id}>
          <Avatar src={user.avatar} size="avatar-lg" />
          <div className="info_content">
            <div className="info_content_title">
              <h2>{user.username}</h2>
              {user._id === auth.user._id ? (
                <button
                  className="btn "
                  onClick={() => setOnEdit(true)}
                  style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                >
                  Chỉnh sửa trang cá nhân
                </button>
              ) : (
                <div>
                  <FollowButton user={user} />
                  <i
                    class="fa-solid fa-ellipsis mx-3"
                    style={{ fontSize: "20px" }}
                    onClick={() => setOnSetting(true)}
                  ></i>
                  {onSetting && (
                    <div className="setting">
                     <div className="setting-info" >
                        <div className="setting_item setting_item_red">
                          Chặn
                        </div>
                        <div className="setting_item setting_item_red">
                          Báo cáo
                        </div>
                        <div
                          className="setting_item"
                          onClick={() => setOnSetting(false)}
                        >
                         Hủy
                        </div>
                     </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="profile_follow_post">
              <div>
                <div>{numberPost}</div>
                <span>Bài viết</span>
              </div>
              <div >
                <div onClick={() => setShowFollowers(true)}>{user.followers.length} </div>
                <span onClick={() => setShowFollowers(true)}>Người theo dõi</span>
                {
                  showFollowers && <Followers users={user.followers} setShowFollowers={setShowFollowers} />
                }
              </div>
              <div>
                <div  onClick={() => setShowFollowing(true)}>{user.following.length} </div>
                <span  onClick={() => setShowFollowing(true)}>Đang theo dõi</span>
                {
                  showFollowing && <Following users={user.following} setShowFollowing={setShowFollowing} />
                }
              </div>
            </div>

            <h6>{user.fullname}</h6>
            <p>{user.address}</p>
            {user.website ? (
              <div className="profile_fb mb-4">
                <i
                  class="fa-brands fa-facebook"
                  style={{
                    color: "#2b6fe3",
                    marginRight: "5px",
                    filter: theme ? "invert(1)" : "invert(0)",
                  }}
                ></i>
                <a
                  href={"" + user.website}
                  target="_blank"
                  style={{ filter: theme ? "invert(1)" : "invert(0)" }} rel="noreferrer"
                >
                  Trang cá nhân facebook
                </a>
              </div>
            ) : (
              ""
            )}
            <p style={{ fontStyle: "inherit" }}>{user.story}</p>
          </div>
          <div></div>
          {onEdit && <EditProfile setOnEdit={setOnEdit} />}
        </div>
      ))}
    </div>
  );
};

export default Info;
