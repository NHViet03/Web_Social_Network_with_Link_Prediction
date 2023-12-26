import { GLOBAL_TYPES } from "./globalTypes";
import { postDataAPI } from "../../utils/fetchData";

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: true });
    const res = await postDataAPI("login", data);
    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    });

    localStorage.setItem("firstLogin", true);
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: false });
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        type: "success",
        title: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        type: "error",
        title: err.response.data.msg,
      },
    });
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: false });
  }
};
export const logout = async (dispatch) => {
  try {
    localStorage.removeItem("firstLogin");
    const res = await postDataAPI("logout");
    window.location.href = "/";
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        type: "success",
        title: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        type: "error",
        title: err.response.data.msg,
      },
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  const firstLogin = localStorage.getItem("firstLogin");
  if (firstLogin) {
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: true });

    try {
      const res = await postDataAPI("refresh_token");
      dispatch({
        type: GLOBAL_TYPES.AUTH,
        payload: {
          token: res.data.access_token,
          user: res.data.user,
        },
      });

      dispatch({ type: GLOBAL_TYPES.LOADING, payload: false });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          type: "error",
          title: err.response.data.msg,
        },
      });
      dispatch({ type: GLOBAL_TYPES.LOADING, payload: false });
    }
  }
};
