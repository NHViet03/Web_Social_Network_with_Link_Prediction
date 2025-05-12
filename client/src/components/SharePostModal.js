import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";
import UserCard from "./UserCard";
import Loading from "./Loading";

import { getDataAPI } from "../utils/fetchData";

const SharePostModal = ({ post }) => {
  const auth = useSelector((state) => state.auth);
  const sharePost = useSelector((state) => state.sharePost);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectUsers, setSelectUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.trim().length === 0) {
      const newArr = auth.user.followers;
      auth.user.following.forEach((user) => {
        if (!newArr.find((item) => item._id === user._id)) {
          newArr.push(user);
        }
      });

      newArr.map((user) => {
        user.image = user.avatar;
        user.title = user.username;
        user.subtitle = user.fullname;
        return user;
      });

      setUsers(newArr);
    } else {
      const handleSearch = async () => {
        try {
          setLoading(true);
          const res = await getDataAPI(
            `search?keyword=${search}&type=user`,
            auth.token
          );
          setUsers(res.data.results);
          setLoading(false);
        } catch (err) {
          dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: { error: err.response.data.msg },
          });
        }
      };

      handleSearch();
    }
  }, [auth.token, auth.user.followers, auth.user.following, dispatch, search]);

  const handleClose = () => {
    if (sharePost) dispatch({ type: GLOBAL_TYPES.SHARE_POST, payload: false });
  };

  const handleSelectUser = (e, user) => {
    if (e.target.checked) {
      setSelectUsers([...selectUsers, user]);
    } else {
      setSelectUsers(selectUsers.filter((item) => item._id !== user._id));
    }
  };

  const handleRemoveUser = (user) => {
    setSelectUsers(selectUsers.filter((item) => item._id !== user._id));
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
          {selectUsers?.map((item, index) => (
            <span key={item._id} className="sharePost_modal-username">
              <span>{item.title}</span>
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
          {loading && <Loading />}
          {users?.map((user, index) => (
            <div key={user._id} className="mb-3 sharePost_modal-user">
              <UserCard
                user={{
                  _id: user._id,
                  username: user.title,
                  fullname: user.subtitle,
                  avatar: user.image,
                }}
              />
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectUsers.find((item) => item._id === user._id)}
                onChange={(e) => handleSelectUser(e, user)}
              />
            </div>
          ))}
        </div>
        <div className="sharePost_modal-button">
          <button
            className="btn w-100 btn_primary"
            disabled={selectUsers.length > 0 ? false : true}
          >
            Gửi
          </button>
        </div>
        <span
          className="material-icons modal-close sharePost-close"
          onClick={handleClose}
        >
          close
        </span>
      </div>
    </form>
  );
};

export default SharePostModal;
