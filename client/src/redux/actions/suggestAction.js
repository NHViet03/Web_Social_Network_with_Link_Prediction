import { GLOBAL_TYPES } from "./globalTypes";
import { getDataAPI } from "../../utils/fetchData";

export const SUGGEST_TYPES = {
  GET_USERS: "GET_SUGGESTED_USERS",
};

export const getSuggestedUsers = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI("suggestions", token);

    dispatch({
      type: SUGGEST_TYPES.GET_USERS,
      payload: res.data.users,
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
