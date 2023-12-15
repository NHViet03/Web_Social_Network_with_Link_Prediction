import { GLOBAL_TYPES } from "./globalTypes";
import { getDataAPI } from "../../utils/fetchData";

export const POST_TYPES = {
  GET_POSTS: "GET_POSTS",
  DELETE_POST: "DELETE_POST",
};

export const getPosts =
  ({
    page = 0,
    search = "",
    from = new Date(new Date().getFullYear(), 0, 1),
    to = new Date(),
    auth,
  }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GLOBAL_TYPES.LOADING, payload: true });

      const res = await getDataAPI(
        `admin/posts?username=${search}&from=${from}&to=${to}&skip=${
          page * 10
        }`,
        auth.token
      );

      dispatch({
        type: POST_TYPES.GET_POSTS,
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

export const deletePost =
  ({ post, reason, auth }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          type: "success",
          title: "Xóa bài viết thành công !",
          data: `Bài viết của ${post.user.username} đã được xóa vì vi phạm "${reason}". Chủ bài viết đã được thông báo về việc này.`,
          duration: 5000,
        },
      });
    } catch (error) {}
  };
