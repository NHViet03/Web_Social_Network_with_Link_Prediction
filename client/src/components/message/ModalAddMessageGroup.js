import React, { useState } from "react";
import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDataAPI } from "../../utils/fetchData";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { MESS_TYPES } from "../../redux/actions/messageAction";
import Loading from "../../components/Loading";
export const ModalAddMessageGroup = ({ setOpenModalGroup }) => {
  const navigate = useNavigate();
  const { auth, message } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUser] = useState([]);
  const [groupUsersChat, setGroupUsersChat] = useState([]);
  const [load, setLoad] = useState(false);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return setSearchUser([]);
    try {
      setLoad(true);
      const res = await getDataAPI(
        `search?username=${search}&mesagechatbox=${auth.user._id}`,
        auth.token
      );
      setSearchUser(res.data.users);
      setLoad(false);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };
  const handleCreateGroupChat = () => {
    if (groupUsersChat.length === 0) return;
    if (groupUsersChat.length === 1) {
      const user = groupUsersChat[0];
      dispatch({
        type: MESS_TYPES.ADD_USER,
        payload: { ...user, text: "", media: [] },
      });
      navigate(`/message/${user._id}`);
      return;
    }
    if (groupUsersChat.length > 1) {
      const userIds = groupUsersChat.map((user) => user._id).join(".");
      const nameGroup = groupUsersChat.map((user) => user.fullname).join(", ") +", "+  auth.user.fullname;
      const avatarGroup = 'https://cdn-icons-png.freepik.com/512/14365/14365803.png';
      const media = [];
      const text = "";
      dispatch({
        type: MESS_TYPES.ADD_USER,
        payload: {
          avatar: avatarGroup,
          _id: userIds,
          fullname: nameGroup,
          username: nameGroup,
          text,
          media,
          isGroup: true,
        },
      });
      setGroupUsersChat([]);
      setOpenModalGroup(false);
      navigate(`/message/${userIds}`);
    }
  };
  const handleAddUserGroupChat = (user) => {
    const checkUser = groupUsersChat.find((item) => item._id === user._id);
    if (checkUser) {
      setGroupUsersChat(groupUsersChat.filter((item) => item._id !== user._id));
    } else {
      setGroupUsersChat([...groupUsersChat, user]);
    }
  };
  return (
    <div className="modal-addmess">
      <div className="modal-addmess_content">
        <div className="modal-addmess_header">
          <div></div>
          <h5 className="modal-addmess_content-h5">Tạo tin nhắn nhóm mới</h5>
          <i
            class="fa fa-times"
            aria-hidden="true"
            onClick={() => setOpenModalGroup(false)}
          ></i>
        </div>
        <div className="modal-addmess_content-search">
          <h5>Đến:</h5>
          <input
            type="text"
            placeholder="Tìm kiếm và nhấn Enter..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            onKeyDown={(e) => (e.key === "Enter" ? handleSearch(e) : null)}
          />
        </div>

        <div
          style={{
            marginTop: "10px",
          }}
        >
          <h5
            style={{
              fontSize: "15px",
              fontWeight: "700",
              marginBottom: "0px",
              marginLeft: "0px",
            }}
          >
            Nhóm của bạn:
          </h5>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px 10px",
              gap: "10px",
              Width: "200px",
              overflowX: "scroll",
            }}
          >
            {groupUsersChat.map((user) => (
              <div
                key={user._id}
                className="message_user mt-2"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  backgroundColor: "#D97B5C",
                  padding: "5px 10px",
                  color: "#fff",
                  alignItems: "center",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    marginBottom: "0px",
                    marginLeft: "0px",
                  }}
                >
                  {user.username}
                </p>
                <i
                  className="fa fa-times"
                  aria-hidden="true"
                  onClick={() => handleAddUserGroupChat(user)}
                ></i>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-addmess_message_chat_list">
          {load && <Loading />}
          {searchUsers.length !== 0 ? (
            <>
              {searchUsers.map((user) => (
                <div
                  key={user._id}
                  className="message_user mt-2"
                  style={{
                    display: load ? "none" : "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "5px 10px",
                    borderBottom: "1px solid #ccc",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  <UserCard user={user} size="avatar-middle" />
                  {/* checkbox button */}
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={user._id}
                    onChange={() => handleAddUserGroupChat(user)}
                    checked={groupUsersChat.some(
                      (item) => item._id === user._id
                    )}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              <h6
                className="my-3 mx-3 flex"
                style={{ display: load ? "none" : "block" }}
              >
                Không có người dùng phù hợp
              </h6>
            </>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <button
            className="btn btn-primary"
            style={{
              width: "100%",
              height: "40px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "20px",
              border: "none",
              backgroundColor: "#D97B5C",
              marginTop: "10px",
              marginBottom: "10px",
            }}
            onClick={() => handleCreateGroupChat()}
          >
            Tạo nhóm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddMessageGroup;
