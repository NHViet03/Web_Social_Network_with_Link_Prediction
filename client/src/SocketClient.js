import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NOTIFIES_TYPES } from "./redux/actions/notifyAction";
import { MESS_TYPES } from "./redux/actions/messageAction";
import { GLOBAL_TYPES } from "./redux/actions/globalTypes";
import { checkMapTrue } from "./utils/helper";
import { getDataAPI } from "./utils/fetchData";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const SocketClient = () => {
  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);
  const online = useSelector((state) => state.online);
  const call = useSelector((state) => state.call);
  const message = useSelector((state) => state.message);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const dispatch = useDispatch();

  // Notification
  useEffect(() => {
    socket.on("createNotifyToClient", (notify) => {
      dispatch({
        type: NOTIFIES_TYPES.CREATE_NOTIFY,
        payload: notify,
      });
    });

    return () => socket.off("createNotifyToClient");
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on("removeNotifyToClient", (msg) => {
      dispatch({
        type: NOTIFIES_TYPES.REMOVE_NOTIFY,
        payload: msg,
      });
    });

    return () => socket.off("removeNotifyToClient");
  }, [dispatch, socket]);

  // Gọi để cập nhật số lượng tin nhắn mới
  const fetchNumberNewMessage = async () => {
    try {
      const res = await getDataAPI("numberNewMessage", auth.token);
      dispatch({
        type: MESS_TYPES.NUMBERNEWMESSAGE,
        payload: res.data?.numberNewMessage,
      });
    } catch (err) {
      console.error("Lỗi khi lấy số lượng tin nhắn mới:", err);
    }
  };

  // Message
  useEffect(() => {
    socket.on("addMessageToClient", (msg) => {
      fetchNumberNewMessage();
      dispatch({ type: MESS_TYPES.ADD_MESSAGE_SECOND, payload: msg });

      const checkUserAccept = checkMapTrue(
        auth.user._id,
        msg.conversation.recipientAccept
      );
      if (
        (checkUserAccept && message.mainBoxMessage) ||
        (!checkUserAccept && !message.mainBoxMessage)
      ) {
        dispatch({ type: MESS_TYPES.ADD_USER_SECOND, payload: msg });
      }
    });

    return () => socket.off("addMessageToClient");
  }, [dispatch, socket, auth.user._id, message.mainBoxMessage]);

  //createGroupChatToClient
  useEffect(() => {
    socket.on("createGroupChatToClient", (data) => {
      dispatch({ type: MESS_TYPES.ADD_GROUP_CHAT, payload: data });
    });
    return () => socket.off("createGroupChatToClient");
  }, [dispatch, socket]);

  //editMessageToClient
  useEffect(() => {
    socket.on("editMessageToClient", (msg) => {
      dispatch({ type: MESS_TYPES.EDIT_MESSAGE_SOCKET_SECOND, payload: msg });
    });
    return () => socket.off("editMessageToClient");
  }, [dispatch, socket]);

  //updateManagerGroupToClient
  useEffect(() => {
    socket.on("updateManagerGroupToClient", (data) => {
      if (message.modalManageGroup !== null) {
        dispatch({
          type: MESS_TYPES.MODAL_MANAGE_GROUP,
          payload: data.conversation,
        });
      }
      dispatch({
        type: MESS_TYPES.ALERT_IN_GROUP,
        payload: data.conversation,
      });
    });
    return () => socket.off("updateManagerGroupToClient");
  }, [dispatch, socket, message.modalManageGroup]);

  //removeUserFromGroupToClient
  useEffect(() => {
    socket.on("removeUserFromGroupToClient", (data) => {
      if (data.userId === auth.user._id) {
        // Xóa khỏi danh sách cuộc trò chuyện nếu người dùng bị xóa khỏi nhóm
        dispatch({
          type: MESS_TYPES.REMOVE_USER_FROM_GROUP,
          payload: data.conversation,
        });

        const pathname = location.pathname; // vd: "/message/6842f129701da552d0165a1a"
        const pathParts = pathname.split("/"); // ["", "message", "6842f129701da552d0165a1a"]
        const id = pathParts[2]; // "6842f129701da552d0165a1a"
        console.log("ID cuộc trò chuyện:", id);
        if (id === data.conversation._id) {
          console.log("Bạn đã bị xóa khỏi nhóm");
          navigate("/message");
        }
      } else {
        if (message.modalManageGroup !== null) {
          dispatch({
            type: MESS_TYPES.MODAL_MANAGE_GROUP,
            payload: data.conversation,
          });
        }
        dispatch({
          type: MESS_TYPES.ALERT_IN_GROUP,
          payload: data.conversation,
        });
      }
    });
    return () => socket.off("removeUserFromGroupToClient");
  }, [dispatch, socket, auth.user._id, message.modalManageGroup, id, navigate]);

  //leaveGroupChatToClient
  useEffect(() => {
    socket.on("leaveGroupChatToClient", (data) => {
      if (message.modalManageGroup !== null) {
        dispatch({
          type: MESS_TYPES.MODAL_MANAGE_GROUP,
          payload: data.conversation,
        });
      }
      dispatch({
        type: MESS_TYPES.ALERT_IN_GROUP,
        payload: data.conversation,
      });
    });
    return () => socket.off("leaveGroupChatToClient");
  }, [dispatch, socket, message.modalManageGroup]);

  //revokeMessageToClient
  useEffect(() => {
    socket.on("revokeMessageToClient", (msg) => {
      dispatch({ type: MESS_TYPES.REVOKE_MESSAGE_SECOND, payload: msg });
    });
    return () => socket.off("revokeMessageToClient");
  }, [dispatch, socket]);

  // joinUser
  useEffect(() => {
    socket.emit("joinUser", auth.user);
  }, [socket, auth.user]);

  // Check User Online / Offline
  useEffect(() => {
    socket.emit("checkUserOnline", auth.user);
  }, [auth.user, socket]);

  useEffect(() => {
    socket.on("checkUserOnlineToMe", (data) => {
      data.forEach((item) => {
        if (!online.includes(item.id)) {
          dispatch({ type: GLOBAL_TYPES.ONLINE, payload: item.id });
        }
      });
    });

    return () => socket.off("checkUserOnlineToMe");
  }, [dispatch, socket, online]);

  useEffect(() => {
    socket.on("checkUserOnlineToClient", (id) => {
      if (!online.includes(id)) {
        dispatch({ type: GLOBAL_TYPES.ONLINE, payload: id });
      }
    });

    return () => socket.off("checkUserOnlineToClient");
  }, [dispatch, socket, online]);

  // Check User Offline
  useEffect(() => {
    socket.on("CheckUserOffline", (id) => {
      dispatch({ type: GLOBAL_TYPES.OFFLINE, payload: id });
    });

    return () => socket.off("CheckUserOffline");
  }, [dispatch, socket]);

  // Call User
  useEffect(() => {
    socket.on("callUserToClient", (data) => {
      dispatch({ type: GLOBAL_TYPES.CALL, payload: data });
    });
    return () => socket.off("callUserToClient");
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on("userBusy", (data) => {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: `${call.username} đang bận` },
      });
    });
    return () => socket.off("userBusy");
  }, [dispatch, socket, call]);

  return <></>;
};

export default SocketClient;
