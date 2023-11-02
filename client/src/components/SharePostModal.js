import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";
import UserCard from "./UserCard";


const SharePostModal = ({ post }) => {
  const { homePosts,sharePost } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectUsers, setSelectUsers] = useState([]);

  useEffect(() => {
    // Fake API
    setUsers(homePosts.users);
  }, [homePosts.users]);

  const handleClose = () => {
    if (sharePost)
      dispatch({ type: GLOBAL_TYPES.SHARE_POST, payload: false });
  };

  const handleSelectUser = (e, user) => {
    if (e.target.checked) {
      setSelectUsers([...selectUsers, user]);
    } else {
      setSelectUsers(
        selectUsers.filter((item) => item._id !== user._id)
      );
    }
  };
  const handleRemoveUser = (user) => {
    setSelectUsers(
      selectUsers.filter((item) => item._id !== user._id)
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="sharePost_modal" onSubmit={handleSubmit}>
      <div className="sharePost_modal-content">
        <h6 className="sharePost_modal-title">Chia sẻ</h6>
        <div className="sharePost_modal-search">
          <span style={{ fontWeight: "600" }}>Tới: </span>
          {selectUsers &&
            selectUsers.map((item, index) => (
              <span key={index} className="sharePost_modal-username">
                <span>{item.username}</span>
                <span
                  className="material-icons"
                  style={{ transform: "translateY(1px)", cursor: "pointer" }}
                  onClick={() => handleRemoveUser(item)}
                >
                  close
                </span>
              </span>
            ))}
          <input
            className="form-control"
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sharePost_modal-result">
          <h6 className="px-3 py-2" style={{ fontWeight: "600" }}>
            Gợi ý
          </h6>
          {users &&
            users.map((user, index) => (
              <div key={index} className="mb-3 sharePost_modal-user">
                <UserCard
                  avatar={user.avatar}
                  username={user.username}
                  fullname={user.fullname}
                />
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectUsers.find(
                    (item) => item._id === user._id
                  )}
                  onChange={(e) => handleSelectUser(e, user)}
                />
              </div>
            ))}
        </div>
        <div className="sharePost_modal-button">
          <button className="btn w-100 btn_primary" disabled={selectUsers.length>0 ? false : true}>Gửi</button>
        </div>
        <span className="material-icons sharePost-close" onClick={handleClose}>
          close
        </span>
      </div>
    </form>
  );
};

export default SharePostModal;
