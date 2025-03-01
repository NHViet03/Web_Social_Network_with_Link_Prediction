import { GLOBAL_TYPES } from "./globalTypes";
import { patchDataAPI, postDataAPI } from "../../utils/fetchData";
import valid from "../../utils/valid";

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI("login", data);
    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    });

    localStorage.setItem("firstLogin", true);
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};
export const logout = async (dispatch) => {
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
    localStorage.removeItem("firstLogin");
    const res = await postDataAPI("logout");
    window.location.href = "/";
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  const firstLogin = localStorage.getItem("firstLogin");
  if (firstLogin) {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });

    try {
      const res = await postDataAPI("refresh_token");
      dispatch({
        type: GLOBAL_TYPES.AUTH,
        payload: {
          token: res.data.access_token,
          user: res.data.user,
        },
      });

      dispatch({ type: GLOBAL_TYPES.ALERT, payload: {} });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  }
};

export const validData = (data) => async (dispatch) => {
  const check = valid(data);
  if (check.errLength > 0)
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: check.errMsg });
  return check.errLength > 0;
};

export const verifyOTP = (userID) => async (dispatch) => {
  try {
    console.log(userID);
    // dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
    // const res = await postDataAPI("register", data);
    // dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: false } });

    localStorage.setItem("firstLogin", true);
    // setRegisterStep((preStep) => preStep + 1);
    // dispatch({
    //   type: GLOBAL_TYPES.ALERT,
    //   payload: {
    //     success: res.data.msg,
    //   },
    // });
  } catch (err) {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: false } });
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.message,
      },
    });
  }
};
export const register = (data, setRegisterStep) => async (dispatch) => {
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI("register", data);
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: false } });

    // save res.data.userID to local storage
    localStorage.setItem("userID", res.data.userID);

    setRegisterStep((preStep) => preStep + 1);
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: false } });
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: err.response.data.message,
      },
    });
    setRegisterStep((preStep) => preStep - 1);
  }
};
export const changePassword =
  ({ data, auth }) =>
  async (dispatch) => {
    const { confirmPassword } = data;

    if (confirmPassword.length < 6)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: "Mật khẩu mới phải nhiều hơn 6 kí tự",
        },
      });

    try {
      const res = await patchDataAPI(
        "changepassword",
        {
          password: data.password,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
          user: auth.user,
        },
        auth.token
      );

      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          success: res.data.msg,
        },
      });
      console.log(res);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };
