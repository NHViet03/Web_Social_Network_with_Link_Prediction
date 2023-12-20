import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NOTIFIES_TYPES } from "./redux/actions/notifyAction";
import { MESS_TYPES } from "./redux/actions/messageAction";
import { GLOBAL_TYPES } from "./redux/actions/globalTypes";

const SocketClient = () => {
  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);
  const online = useSelector((state) => state.online);
  const call = useSelector((state) => state.call);


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

  // Message
  useEffect(() => {
    socket.on("addMessageToClient", (msg) => {
    dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg });
    dispatch({ type: MESS_TYPES.ADD_USER, payload: {...msg.user, text: msg.text, media: msg.media} })
    });
    return () => socket.off("addMessageToClient");
  }, [dispatch, socket]);
 
  // joinUser
  useEffect(() => {
    socket.emit('joinUser', auth.user)
  },[socket, auth.user])
  
    // Check User Online / Offline
  useEffect(() => {
    socket.emit("checkUserOnline", auth.user);
  }, [auth.user, socket]);

  useEffect(() => {
    socket.on("checkUserOnlineToMe", data => {
      data.forEach(item => {
        if(!online.includes(item.id)){
          dispatch({type: GLOBAL_TYPES.ONLINE, payload: item.id})
        }
      })
    });
 
    return () => socket.off("checkUserOnlineToMe");
  }, [dispatch, socket, online]);

  useEffect(() => {
    socket.on("checkUserOnlineToClient", id => {
      if(!online.includes(id)){
        dispatch({type: GLOBAL_TYPES.ONLINE, payload: id})
      }
    });
 
    return () => socket.off("checkUserOnlineToClient");
  }, [dispatch, socket, online]);

  // Check User Offline
  useEffect(() => {
    socket.on("CheckUserOffline", id => {
      dispatch({type: GLOBAL_TYPES.OFFLINE, payload: id})
    });
 
    return () => socket.off("CheckUserOffline");
  }, [dispatch, socket]);


  // Call User
   useEffect(() => {
    socket.on("callUserToClient", data => {
      dispatch({type: GLOBAL_TYPES.CALL, payload: data})
    });
    return () => socket.off("callUserToClient");
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on("userBusy", data => {
      dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: `${call.username} đang bận`}})    });
    return () => socket.off("userBusy");
  }, [dispatch, socket, call]);

  return <></>;
};

export default SocketClient;
