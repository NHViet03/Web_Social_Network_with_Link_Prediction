import React, { useEffect, useState } from "react";
import Info from "../../components/profile/Info";
import Posts from "../../components/profile/Posts";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../components/Loading";
import { getProfileUsers } from "../../redux/actions/profileAction";
import { useParams } from "react-router-dom";
import grid from "../../images/grid.png";
import Saved from "../../components/profile/Saved";
import Tagged from "../../components/profile/Tagged";

const Profile = () => {
  const { profile, auth } = useSelector((state) => state);
  const [activeTab, setActiveTab] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProfileUsers({ id, auth }));
  }, [id, auth, dispatch]);

  const generateTab = () => {
    switch (activeTab) {
      case 1:
        return (
          <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
        );
      case 2:
        return <Saved auth={auth} dispatch={dispatch} />;
      case 3:
        return <Tagged auth={auth} dispatch={dispatch} id={id} />;
      default:
        return (
          <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
        );
    }
  };

  return (
    <div className="profile">
      <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />
      <div className="profile_tab">
        <button
          className={activeTab === 1 ? "active" : ""}
          onClick={() => setActiveTab(1)}
        >
          <img src={grid} className="grid" alt="" />
          <span>Bài viết</span>
        </button>

        {auth.user._id === id && (
          <button
            className={activeTab === 2 ? "active" : ""}
            onClick={() => setActiveTab(2)}
          >
            <i className="fa-regular fa-bookmark"></i>
            <span>Bài viết đã lưu</span>
          </button>
        )}

        <button
          className={activeTab === 3 ? "active" : ""}
          onClick={() => setActiveTab(3)}
        >
          <i className="fa-regular fa-id-badge"></i>
          <span>Được gắn thẻ</span>
        </button>
      </div>
      {profile.loading ? <Loading /> : <>{generateTab()}</>}
    </div>
  );
};

export default Profile;
