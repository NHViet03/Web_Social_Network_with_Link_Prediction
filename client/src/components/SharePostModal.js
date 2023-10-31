import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";
import UserCard from "./UserCard";

const fakeUsers = [
  {
    _id: "abc123",
    username: "xeesoxee",
    fullname: "Han So-hee",
    avatar:
      "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/396615157_551338183844421_7619172125110417112_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHRW7uHlh5XjzitCTbdFZMzNrbJfkSOG9E2tsl-RI4b0WVQrhPu2d1BZkDLRHgyc2zz7803SxyQYdAJ1xZ0ZK2e&_nc_ohc=E8Nu3nNn5psAX9UeJCw&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdQtxzBRmbH7kuTuJj88fJBfpWJArRRQU3jWCX4BDMA8_w&oe=6566D742",
  },
  {
    _id: "abc124",
    username: "shinseulkee",
    fullname: "Shin Seul-Ki",
    avatar:
      "https://scontent.fsgn5-8.fna.fbcdn.net/v/t1.15752-9/367368199_675352334573886_277255189688645264_n.png?_nc_cat=109&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHMqdVfgKCChOgil1DxZgxgyScKg0DqDY3JJwqDQOoNjRAV8wQGv0wMmxqadi4h5dpyLjakhnqmh_vzVxil8BHD&_nc_ohc=NQZidFJy-1AAX9OTiLB&_nc_ht=scontent.fsgn5-8.fna&oh=03_AdSGrIxrCgiQfnLrMP9ljzrF0JiGb4eDHp9BSugT5DQcfQ&oe=6566D768",
  },
  {
    _id: "abc125",
    username: "rohyoonseo",
    fullname: "Roh Yoon-seo",
    avatar:
      "https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.15752-9/396419820_887913802728349_2601651184966517625_n.png?_nc_cat=105&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGJur1UcJHdQB6lcwM3ZLlPZ63kFHMYKDNnreQUcxgoMyk1ANCoNc1WEa1qkikaLrB3j5g3q_vlKdG02jJqlQR6&_nc_ohc=frgmMR08utkAX8RzkOi&_nc_ht=scontent.fsgn5-2.fna&oh=03_AdSfsBFgUYCi7toROjKHPqDdEXHRIeZBISSNOgvGpqobJg&oe=6566E1FA",
  },
  {
    _id: "abc127",
    username: "xeesoxee",
    fullname: "Han So-hee",
    avatar:
      "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/396615157_551338183844421_7619172125110417112_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHRW7uHlh5XjzitCTbdFZMzNrbJfkSOG9E2tsl-RI4b0WVQrhPu2d1BZkDLRHgyc2zz7803SxyQYdAJ1xZ0ZK2e&_nc_ohc=E8Nu3nNn5psAX9UeJCw&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdQtxzBRmbH7kuTuJj88fJBfpWJArRRQU3jWCX4BDMA8_w&oe=6566D742",
  },
  {
    _id: "abc126",
    username: "shinseulkee",
    fullname: "Shin Seul-Ki",
    avatar:
      "https://scontent.fsgn5-8.fna.fbcdn.net/v/t1.15752-9/367368199_675352334573886_277255189688645264_n.png?_nc_cat=109&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHMqdVfgKCChOgil1DxZgxgyScKg0DqDY3JJwqDQOoNjRAV8wQGv0wMmxqadi4h5dpyLjakhnqmh_vzVxil8BHD&_nc_ohc=NQZidFJy-1AAX9OTiLB&_nc_ht=scontent.fsgn5-8.fna&oh=03_AdSGrIxrCgiQfnLrMP9ljzrF0JiGb4eDHp9BSugT5DQcfQ&oe=6566D768",
  },
];

const SharePostModal = ({ post }) => {
  const { sharePost } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectUsers, setSelectUsers] = useState([]);

  useEffect(() => {
    // Fake API
    setUsers(fakeUsers);
  }, []);

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
