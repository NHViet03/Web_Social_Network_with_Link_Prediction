import { GLOBAL_TYPES } from "./globalTypes";
import { getDataAPI } from "../../utils/fetchData";

export const USER_TYPES = {
  GET_USERS: "GET_USERS",
  FIRST_LOAD: "FIRST_LOAD_USERS",
};

export const getUsers =
  ({
    page = 0,
    search = "",
    from = new Date(new Date().getFullYear(), 0, 1),
    to = new Date(),
    f_followers = 0,
    t_followers = 1000,
    auth,
  }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GLOBAL_TYPES.LOADING, payload: true });

      const res = await getDataAPI(
        `admin/users?username=${search}&from=${from}&to=${to}&f_from=${f_followers}&f_to=${t_followers}&skip=${
          page * 10
        }`,
        auth.token
      );
      dispatch({
        type: USER_TYPES.GET_USERS,
        payload: res.data,
      });

      dispatch({ type: GLOBAL_TYPES.LOADING, payload: false });
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          type: "error",
          title: error.response.data.msg,
        },
      });
    }
  };
