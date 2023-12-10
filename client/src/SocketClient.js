import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NOTIFIES_TYPES } from "./redux/actions/notifyAction";

const SocketClient = () => {
  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit("joinUser", auth.user._id);
  }, [auth.user._id, socket]);

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

  return <></>;
};

export default SocketClient;
