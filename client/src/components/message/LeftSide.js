import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserCard from "../UserCard";
import { useParams, useNavigate } from "react-router-dom";
import {
  MESS_TYPES,
  getConversations,
} from "../../redux/actions/messageAction";
import Loading from "../Loading";
import { postDataAPI } from "../../utils/fetchData";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { checkMapTrue } from "../../utils/helper";

export const LeftSide = ({ setOpenModal, setOpenModalGroup }) => {
  const { auth, message, online } = useSelector((state) => state);
  const { id } = useParams();
  const pageEnd = useRef();
  const firstRun = useRef(true);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function
  const isActive = (user) => {
    if (id === user._id) return "active";
    return "";
  };
  const isRead = (user) => {
    const checkUserIsRead = checkMapTrue(auth.user._id, user.isRead);
    return checkUserIsRead ? "" : "unread";
  };
  const handleClickMessageUser = (user) => {
    //Update UI read messageư
    navigate(`/message/${user._id}`);

    let listID = user._id.split(".");
    // nếu listID chưa có auth.user._id thì thêm vào
    if (!listID.includes(auth.user._id)) {
      listID.push(auth.user._id);
    }
    // Read message action
    dispatch({
      type: MESS_TYPES.READMESSAGE,
      payload: {
        id: user._id,
        userId: auth.user._id,
      },
    });
    try {
      //Save to DB read message = true
       dispatch({
      type: MESS_TYPES.NUMBERNEWMESSAGE_MINUS,
      payload: { },
    });
      postDataAPI(`readMessage/${auth.user._id}`, {listID}, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };

  const handleChangeMainBoxMessage = (mainBoxMessage) => {
    dispatch({
      type: MESS_TYPES.MAINBOXMESSAGE,
      payload: mainBoxMessage,
    });
  };

  // UseEffect

  useEffect(() => {
    if (message.firstLoad) return;
    dispatch(
      getConversations({ auth, mainBoxMessage: message.mainBoxMessage })
    );
  }, [dispatch, message.firstLoad, message.mainBoxMessage, auth]);

  // useEffect for change mainBoxMessage
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    dispatch(
      getConversations({ auth, mainBoxMessage: message.mainBoxMessage })
    );
  }, [message.mainBoxMessage]);

  // Load More
  // useEffect(() => {
  //   const observer = new IntersectionObserver(entries => {
  //     if(entries[0].isIntersecting){
  //       setPage(p => p + 1)
  //     }
  //   }, {
  //     threshold: 0.1
  //   })
  //   observer.observe(pageEnd.current)
  // },[setPage])

  // Check User Online / Offline
  useEffect(() => {
    if (message.firstLoad) {
      dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online });
    }
  }, [online, message.firstLoad, dispatch]);
  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(
        getConversations({ auth, page, mainBoxMessage: message.mainBoxMessage })
      );
    }
  }, [message.resultUsers, page, message.mainBoxMessage, auth, dispatch]);
  return (
    <>
      <div className="message_header">
        <div className="message_header-swicthAccountandModal">
          <div className="message_header-namedropdown">
            <h2 onClick={() => navigate("/message")}>{auth.user.username}</h2>
            <i class="fa fa-angle-down" aria-hidden="true"></i>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "20px" }}
            className="message_header-newchat d-flex"
          >
            <i
              style={{ fontSize: "20px", cursor: "pointer" }}
              className="fa fa-users"
              onClick={() => {
                setOpenModalGroup(true);
              }}
            ></i>
            <i
              style={{ fontSize: "20px", cursor: "pointer" }}
              class="fa fa-user-plus"
              aria-hidden="true"
              onClick={() => setOpenModal(true)}
            ></i>
          </div>
        </div>
        <div className="message_header-request">
          {/* if mainBoxMessage == true => h3 has class message_header-request-active */}
          <h3
            className={
              message.mainBoxMessage ? "message_header-request-active" : ""
            }
            onClick={() => handleChangeMainBoxMessage(true)}
          >
            Tin nhắn
          </h3>
          {/* if mainBoxMessage == false => h4 has class message_header-request-active */}
          <h4
            className={
              !message.mainBoxMessage ? "message_header-request-active" : ""
            }
            onClick={() => handleChangeMainBoxMessage(false)}
          >
            Tin nhắn chờ
          </h4>
        </div>
      </div>
      <div className="message_chat_list">
        {
          <div className="message_chat_card">
            {message.loadingConversation ? (
              <div className="loading-conversation mb-[10px]">
                <Loading />
              </div>
            ) : (
              message.users.map((user) => (
                <div
                  className={`message_user ${isRead(user)}  ${isActive(user)}`}
                  key={user._id}
                  onClick={() => handleClickMessageUser(user)}
                >
                  <UserCard user={user} size="avatar-middle">
                    {user.online ? (
                      <i className="fa-solid fa-circle active"></i>
                    ) : (
                      auth.user.following.find(
                        (item) => item._id === user._id
                      ) && <i className="fa-solid fa-circle"></i>
                    )}
                  </UserCard>
                </div>
              ))
            )}
            <button
              type="button"
              className="btn btn-warning"
              style={{ opacity: "0" }}
              ref={pageEnd}
            >
              Load More
            </button>
          </div>
        }
      </div>
    </>
  );
};
export default LeftSide;
