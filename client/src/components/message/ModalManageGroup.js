import React, { useEffect, useState } from "react";
import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getDataAPI } from "../../utils/fetchData";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { MESS_TYPES } from "../../redux/actions/messageAction";
import Loading from "../../components/Loading";
import { imageGroupDefaultLink } from "../../utils/imageGroupDefaultLink";
export const ModalManageGroup = () => {
  const navigate = useNavigate();
  const { auth, message } = useSelector((state) => state);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUser] = useState([]);
  const [groupUsersChat, setGroupUsersChat] = useState([]);
  const [load, setLoad] = useState(false);
  const [loadInfoGroup, setLoadInfoGroup] = useState(false);
  const [isBoxManageGroup, setIsBoxManageGroup] = useState(true);
  const [activeDropdownUserId, setActiveDropdownUserId] = useState(null);

  //====UseEffect====
  //useEffect gọi tới API conversation/${id} để lấy thông tin cuộc trò chuyện
  const fetchConversation = async () => {
    try {
      setLoadInfoGroup(true);
      const res = await getDataAPI(`conversation/${id}`, auth.token);
      dispatch({
        type: MESS_TYPES.MODAL_MANAGE_GROUP,
        payload: res.data.conversation,
      });
      setLoadInfoGroup(false);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };
  useEffect(() => {
    fetchConversation();
  }, [id, auth.token, dispatch]);

  // ====Functions====
  const handleToggleDropdown = (userId) => {
    if (activeDropdownUserId === userId) {
      setActiveDropdownUserId(null);
    } else {
      setActiveDropdownUserId(userId);
    }
  };

  const handleAssignAdmin = (userId) => {
    console.log("Chỉ định admin cho:", userId);
    // TODO: Gửi API hoặc dispatch redux để cập nhật admin
    setActiveDropdownUserId(null);
  };

  const handleRemoveAdmin = (userId) => {
    console.log("Xóa quyền admin của:", userId);
    // TODO: Gửi API hoặc dispatch redux để xóa quyền admin
    setActiveDropdownUserId(null);
  };

  const handleRemoveFromGroup = (userId) => {
    console.log("Xóa khỏi nhóm:", userId);
    // TODO: Gửi API hoặc dispatch redux để xóa người dùng khỏi nhóm
    setActiveDropdownUserId(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return setSearchUser([]);
    try {
      setLoad(true);
      const res = await getDataAPI(
        `searchmessage?username=${search}&mesagechatbox=${auth.user._id}`,
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
      const userData = {
        avatar: user.avatar,
        fullname: user.fullname,
        username: user.username,
        _id: user._id,
        text: "",
        media: [],
        isVisible: {
          [auth.user._id]: true,
          [user._id]: true,
        },
        recipientAccept: {
          [auth.user._id]: true,
          [user._id]: true,
        },
        isRead: {
          [auth.user._id]: true,
          [user._id]: true,
        },
        isGroup: false,
        online: false,
      };
      dispatch({
        type: MESS_TYPES.ADD_USER,
        payload: userData,
      });
      navigate(`/message/${user._id}`);
      return;
    }
    if (groupUsersChat.length > 1) {
      let userIds = groupUsersChat.map((user) => user._id).join(".");
      userIds += `.${auth.user._id}`;
      const nameGroup =
        groupUsersChat.map((user) => user.fullname).join(", ") +
        ", " +
        auth.user.fullname;
      const avatarGroup = imageGroupDefaultLink;
      const userData = {
        avatar: avatarGroup,
        fullname: nameGroup,
        username: nameGroup,
        _id: userIds,
        text: "",
        media: [],
        isVisible: {
          [auth.user._id]: true,
          ...groupUsersChat.reduce((acc, user) => {
            acc[user._id] = true;
            return acc;
          }, {}),
        },
        recipientAccept: {
          [auth.user._id]: true,
          ...groupUsersChat.reduce((acc, user) => {
            acc[user._id] = true;
            return acc;
          }, {}),
        },
        isRead: {
          [auth.user._id]: true,
          ...groupUsersChat.reduce((acc, user) => {
            acc[user._id] = true;
            return acc;
          }, {}),
        },
        isGroup: true,
        online: false,
      };
      dispatch({
        type: MESS_TYPES.ADD_USER,
        payload: userData,
      });
      setGroupUsersChat([]);
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
  const handleChangeBoxManage = (isManageGroup) => {
    fetchConversation();
    setIsBoxManageGroup(isManageGroup);
  };
  return (
    <div className="modal-addmess">
      <div className="modal-addmess_content">
        <div className="modal-addmess_header">
          <div></div>
          <h5 className="modal-addmess_content-h5">Thông tin nhóm</h5>
          <i
            class="fa fa-times"
            aria-hidden="true"
            onClick={() => {
              dispatch({
                type: MESS_TYPES.MODAL_MANAGE_GROUP,
                payload: null,
              });
            }}
          ></i>
        </div>
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #ccc",
            paddingTop: "15px",
            paddingBottom: "15px",
          }}
        >
          <div
            onClick={() => handleChangeBoxManage(true)}
            style={{
              width: "50%",
              textAlign: "center",
              padding: "12px 0",
              backgroundColor: isBoxManageGroup ? "#D97B5C" : "#fff",
              color: isBoxManageGroup ? "#fff" : "#333",
              fontWeight: isBoxManageGroup ? "600" : "600",
              border: "1px solid #D97B5C",
              borderRight: "none",
              borderRadius: "20px 0 0 20px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Thành viên nhóm
          </div>
          <div
            onClick={() => handleChangeBoxManage(false)}
            style={{
              width: "50%",
              textAlign: "center",
              padding: "12px 0",
              backgroundColor: !isBoxManageGroup ? "#D97B5C" : "#fff",
              color: !isBoxManageGroup ? "#fff" : "#333",
              fontWeight: !isBoxManageGroup ? "600" : "600",
              border: "1px solid #D97B5C",
              borderLeft: "none",
              borderRadius: "0 20px 20px 0",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Thêm thành viên
          </div>
        </div>

        {/* Thông tin nhóm */}
        {isBoxManageGroup && !loadInfoGroup && (
          // map qua từng message.modalManageGroup.recipients để hiển thị UserCard
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                minHeight: "650px",
                overflowY: "auto",
                marginTop: "10px",
              }}
            >
              {message?.modalManageGroup?.recipients?.map((user) => (
                <div
                  style={{
                    width: "100%",
                    padding: "10px",
                  }}
                >
                  <UserCard
                    key={user._id}
                    user={user}
                    size="avatar-middle"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "5px 10px",
                      borderBottom: "1px solid #ccc",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
                    {/* Một cái thẻ div hiển thị Thành viên || Người tạo nhóm || Quản trị viên */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "15px",
                          fontWeight: "700",
                          color: "#333",
                          marginBottom: "0px",
                          marginLeft: "0px",
                          cursor: "pointer",
                        }}
                      >
                        {user._id === message.modalManageGroup.host
                          ? "Người tạo nhóm"
                          : // Kiểm tra xem có user._id có trong message.modalManageGroup.admins hay không,
                          // nếu có thì hiển thị Quản trị viên, nếu không thì hiển thị Thành viên
                          message.modalManageGroup.admins.includes(user._id)
                          ? "Quản trị viên"
                          : "Thành viên"}
                      </p>
                    </div>
                    {/* Hiển thị một option để lựa chọn xóa người dùng khỏi nhóm */}
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          cursor: "pointer",
                          color: "#D97B5C",
                          fontSize: "20px",
                        }}
                        onClick={() => handleToggleDropdown(user._id)}
                      >
                        ...
                      </div>

                      {activeDropdownUserId === user._id && (
                        <div
                          style={{
                            position: "absolute",
                            top: "25px",
                            right: "0px",
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            zIndex: 100,
                            minWidth: "180px",
                          }}
                        >
                          {user._id !== message.modalManageGroup.host._id &&
                            (message.modalManageGroup.admins.includes(
                              user._id
                            ) ? (
                              <>
                                <div
                                  onClick={() => handleRemoveAdmin(user._id)}
                                  style={{
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  Xóa quyền quản trị viên
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  onClick={() => handleAssignAdmin(user._id)}
                                  style={{
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  Chỉ định quản trị viên
                                </div>
                              </>
                            ))}

                          {user._id !== message.modalManageGroup.host._id && (
                            <div
                              onClick={() => handleRemoveFromGroup(user._id)}
                              style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                                color: "red",
                              }}
                            >
                              Xóa khỏi nhóm
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </UserCard>
                </div>
              ))}
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
                className="btn btn-danger"
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
                onClick={() => {
                  dispatch({
                    type: MESS_TYPES.MODAL_MANAGE_GROUP,
                    payload: null,
                  });
                  dispatch({
                    type: MESS_TYPES.DELETE_CONVERSATION,
                    payload: message.modalManageGroup._id,
                  });
                }}
              >
                Rời nhóm
              </button>
            </div>
          </div>
        )}
        {isBoxManageGroup && loadInfoGroup && <Loading />}
        {/* Thêm người mới vào nhóm */}
        {!isBoxManageGroup && (
          <div>
            <div>
              <div className="modal-addmess_content-search">
                <h5>Đến:</h5>
                <input
                  type="text"
                  placeholder="Tìm kiếm và nhấn Enter..."
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  onKeyDown={(e) =>
                    e.key === "Enter" ? handleSearch(e) : null
                  }
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
                  Thành viên mới:
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
                          style={{ border: "1px solid #db4e20" }}
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
                    backgroundColor: "rgb(217, 123, 92)",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                  onClick={() => handleCreateGroupChat()}
                >
                  Thêm vào nhóm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalManageGroup;
