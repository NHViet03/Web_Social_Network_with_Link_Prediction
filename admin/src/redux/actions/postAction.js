import { GLOBAL_TYPES } from "./globalTypes";
import {
  getDataAPI,
  postDataAPI,
  deleteDataAPI,
  putDataAPI,
} from "../../utils/fetchData";

export const POST_TYPES = {
  GET_POSTS: "GET_POSTS",
  FIRST_LOAD: "FIRST_LOAD_POSTS",
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
    const email = {
      to: post.user.email,
      subject: "Dreamers - Vi phạm chính sách bài viết.",
      html: `<h4>Xin chào người dùng ${post.user.fullname},</h4>
    <p>
      Chúng tôi là Dreamers, chúng tôi đã phát hiện bài viết của bạn (ID: ${
        post._id
      }) được đăng tải vào lúc <em>${new Date(
        post.createdAt
      ).toLocaleString()}</em> đã vi phạm chính sách bài viết của chúng tôi với lý do <strong>"${reason}"</strong>. Vì vậy, bài viết của bạn đã bị xóa vĩnh viễn khỏi hệ thống của chúng tôi.
    <p>
    <br/>
    <h5><em>Mọi thắc xin vui lòng liên hệ với chúng tôi qua gmail <u>dreamerssocialuit@gmail.com</u> hoặc liên lạc với nhân viên hỗ trợ qua số điện thoại <u>+84 123 456 789.</u></em>
    </h5>
    <p>Trân trọng,<br/>Đội ngũ Dreamers Social Network
    </p>`,
      attachFiles: [],
    };

    try {
      dispatch({
        type: GLOBAL_TYPES.LOADING,
        payload: true,
      });

      await deleteDataAPI(`/post/${post._id}`, auth.token);
      await postDataAPI(`admin/send_mail`, email, auth.token);

      dispatch({
        type: GLOBAL_TYPES.LOADING,
        payload: false,
      });
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          type: "success",
          title: "Xóa bài viết thành công !",
          data: `Bài viết của ${post.user.username} đã được xóa vì vi phạm "${reason}". Chủ bài viết đã được thông báo về việc này.`,
          duration: 5000,
        },
      });
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          type: "error",
          title: "Xóa bài viết thất bại !",
        },
      });
    }
  };

export const restorePost =
  ({ post, auth }) =>
  async (dispath) => {
    try {
      dispath({ type: GLOBAL_TYPES.LOADING, payload: true });

      await putDataAPI(`admin/post/${post._id}/restore`, {}, auth.token);
      dispath({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          type: "success",
          title: "Khôi phục bài viết thành công !",
        },
      });
    } catch (error) {
      dispath({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          type: "error",
          title: error.response.data.msg,
        },
      });
    } finally {
      dispath({ type: GLOBAL_TYPES.LOADING, payload: false });
    }
  };
