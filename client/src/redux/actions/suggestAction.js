import { GLOBAL_TYPES } from "./globalTypes";
import { getDataAPI } from "../../utils/fetchData";
import axios from "axios";

export const SUGGEST_TYPES = {
  GET_USERS: "GET_SUGGESTED_USERS",
};

export const getSuggestedUsers = (auth, model) => async (dispatch) => {
  try {
    try {
      const res = await axios.get(
        `http://localhost:8000/SuggestionUserBy${model}${auth.user._id}`
      );

      dispatch({
        type: SUGGEST_TYPES.GET_USERS,
        payload: {
          users: res.data.data,
          model: model,
        },
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        error: error.response.data.msg,
      },
    });
  }
};
