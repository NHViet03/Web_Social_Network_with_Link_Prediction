import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "../Avatar";
import { getProfileUsers } from "../../redux/actions/profileAction";
import EditProfile from "./EditProfile";
import FollowButton from "../FollowButton";
const Info = () => {
  const { id } = useParams();
  const { auth , profile, theme} = useSelector((state) => state);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState([]);
  const [onEdit, setOnEdit] = useState(false)

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    }else{
      dispatch(getProfileUsers({users: profile.users, id, auth}))
      const newData = profile.users.filter((user) => user._id === id);
      setUserData(newData);
    }
  }, [id, auth, dispatch, profile.users]);
  return (
    <div className="info">
      {userData.map((user) => (
        <div className="info_container" key={user._id}>
          <Avatar src={user.avatar} size="avatar-lg" />
          <div className="info_content">
            <div className="info_content_title">
              <h2>{user.username}</h2>
              {
                user._id === auth.user._id
                ? <button className="btn " onClick={() => setOnEdit(true)} style={{ filter: theme ? 'invert(1)' : 'invert(0)'}}>
                Chỉnh sửa trang cá nhân
              </button>
                : 
                 <FollowButton/>
              }
            </div>
            <div className="profile_follow_post">
              <div>
                <div>4</div>
                <span>Bài viết</span>
              </div>
              <div>
                <div>{user.followers.length} </div>
                <span>Người theo dõi</span>
              </div>
              <div>
                  <div>{user.following.length} </div>
                  <span>Đang theo dõi</span>
              </div>
            </div>

            <h6>{user.fullname}</h6>
            <p>{user.address}</p>
            <div className="profile_fb mb-4">
            <i class="fa-brands fa-facebook" style={{color: "#2b6fe3", marginRight: "5px"}} ></i>
              <a href={user.website} target="_blank" rel="noreferrer" >
                Trang cá nhân facebook
              </a>
            </div>
            <p style={{fontStyle: 'inherit'}}>{user.story}</p>
          </div>
          <div></div>
          {
            onEdit && <EditProfile setOnEdit={setOnEdit}/>
          }
        </div>
      ))}
    </div>
  );
};

export default Info;
