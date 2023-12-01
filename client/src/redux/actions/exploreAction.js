import { GLOBAL_TYPES } from "./globalTypes";
import { getDataAPI } from "../../utils/fetchData";

export const EXPLORE_TYPES = {
  GET_POSTS: "GET_EXPLORE_POSTS",
  UPDATE_POST: "UPDATE_EXPLORE_POST",
};

export const getDiscoverPosts = ({auth,page=1}) => async (dispatch) => {
  try {
    const res = await getDataAPI(`explore_posts?limit=${page*10}`, auth.token);

    dispatch({
      type: EXPLORE_TYPES.GET_POSTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: error.response.data.msg },
    });
  }
};
