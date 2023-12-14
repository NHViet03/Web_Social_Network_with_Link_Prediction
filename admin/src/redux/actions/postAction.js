import { GLOBAL_TYPES } from "./globalTypes";

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
          duration:5000
        },
      });
    } catch (error) {}
  };
