import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NOTIFIES_TYPES } from "./redux/actions/notifyAction";
import { MESS_TYPES } from "./redux/actions/messageAction";
import { GLOBAL_TYPES } from "./redux/actions/globalTypes";
import { checkMapTrue } from "./utils/helper";
import { getDataAPI } from "./utils/fetchData";

const SocketClient = () => {
  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);
  const online = useSelector((state) => state.online);
  const call = useSelector((state) => state.call);
  const message = useSelector((state) => state.message);

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
    });
    return () => socket.off("updateManagerGroupToClient");
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
