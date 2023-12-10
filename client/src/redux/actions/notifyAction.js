import { GLOBAL_TYPES } from "./globalTypes";
import {
  getDataAPI,
  postDataAPI,
  deleteDataAPI,
  patchDataAPI,
} from "../../utils/fetchData";

export const NOTIFIES_TYPES = {
  GET_NOTIFIES: "GET_NOTIFIES",
  CREATE_NOTIFY: "CREATE_NOTIFY",
  REMOVE_NOTIFY: "REMOVE_NOTIFY",
  UPDATE_NOTIFY: "UPDATE_NOTIFY",
  DELETE_ALL_NOTIFIES: "DELETE_ALL_NOTIFIES",
};

export const createNotify =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    try {
      const res = await postDataAPI("notify", msg, auth.token);

      socket.emit("createNotify", res.data.notify);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const getNotifies = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI("notifies", token);

    dispatch({
      type: NOTIFIES_TYPES.GET_NOTIFIES,
      payload: res.data.notifies,
    });
  } catch (error) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: error.response.data.msg,
      },
    });
  }
};

export const removeNotify =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    dispatch({
      type: NOTIFIES_TYPES.REMOVE_NOTIFY,
      payload: msg,
    });

    // Socket
    socket.emit("removeNotify", msg);

    try {
      await deleteDataAPI(`notify/${msg.id}?url=${msg.url}`, auth.token);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const readNotify =
  ({ notify, auth }) =>
  async (dispatch) => {
    dispatch({
      type: NOTIFIES_TYPES.UPDATE_NOTIFY,
      payload: {
        ...notify,
        isRead: true,
      },
    });

    try {
      await patchDataAPI(`read_notify/${notify._id}`, null, auth.token);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const deleteAllNotifies = (auth) => async (dispatch) => {
  dispatch({
    type: NOTIFIES_TYPES.DELETE_ALL_NOTIFIES,
    payload: [],
  });

  try {
    await deleteDataAPI("notifies", auth.token);
  } catch (error) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: error.response.data.msg,
      },
    });
  }
};
