import { GLOBAL_TYPES } from "./globalTypes";
import {
  getDataAPI,
  deleteDataAPI,
  patchDataAPI,
  postDataAPI,
} from "../../utils/fetchData";

export const REPORTS_TYPES = {
  GET_REPORTS: "GET_REPORTS",
  UPDATE_REPORT: "UPDATE_REPORT",
  DELETE_REPORT: "DELETE_REPORT",
  FIRST_LOAD: "FIRST_LOAD_REPORTS",
};

export const getReports =
  ({
    page = 0,
    search = "",
    status = "all",
    from = new Date(new Date().getFullYear(), 0, 1),
    to = new Date(),
    auth,
  }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GLOBAL_TYPES.LOADING, payload: true });

      const res = await getDataAPI(
        `admin/reports?id=${search}&from=${from}&to=${to}&status=${
          status === "all" ? "" : status
        }&skip=${page * 10}`,
        auth.token
      );

      dispatch({
        type: REPORTS_TYPES.GET_REPORTS,
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

export const validateReport =
  ({ report, deletePost, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GLOBAL_TYPES.LOADING, payload: true });
      await patchDataAPI(
        `admin/report/${report._id}`,
        { status: "validated" },
        auth.token
      );

      if (deletePost) {
        const post = report.post;
        const email = {
          to: post.user.email,
          subject: "Dreamers - Vi phạm chính sách bài viết.",
          html: `<h4>Xin chào người dùng ${post.user.fullname},</h4>
        <p>
          Chúng tôi là Dreamers, chúng tôi đã phát hiện bài viết của bạn (ID: ${
            post._id
          }) được đăng tải vào lúc <em>${new Date(
            post.createdAt
          ).toLocaleString()}</em> đã vi phạm chính sách bài viết của chúng tôi với lý do <strong>"${
            report.reason
          }"</strong>. Vì vậy, bài viết của bạn đã bị xóa vĩnh viễn khỏi hệ thống của chúng tôi.
        <p>
        <br/>
        <h5><em>Mọi thắc xin vui lòng liên hệ với chúng tôi qua gmail <u>dreamerssocialuit@gmail.com</u> hoặc liên lạc với nhân viên hỗ trợ qua số điện thoại <u>+84 123 456 789.</u></em>
        </h5>
        <p>Trân trọng,<br/>Đội ngũ Dreamers Social Network
        </p>`,
          attachFiles: [],
        };
        await deleteDataAPI(`/post/${post._id}`, auth.token);
        await postDataAPI(`admin/send_mail`, email, auth.token);
      }

      dispatch({
        type: REPORTS_TYPES.UPDATE_REPORT,
        payload: {
          ...report,
          status: "validated",
        },
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

export const rejectReport =
  ({ report, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GLOBAL_TYPES.LOADING, payload: true });
      await patchDataAPI(
        `admin/report/${report._id}`,
        { status: "rejected" },
        auth.token
      );
      dispatch({
        type: REPORTS_TYPES.UPDATE_REPORT,
        payload: {
          ...report,
          status: "rejected",
        },
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

export const deleteReport =
  ({ report, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GLOBAL_TYPES.LOADING, payload: true });
      await deleteDataAPI(`admin/report/${report._id}`, auth.token);
      dispatch({
        type: REPORTS_TYPES.DELETE_REPORT,
        payload: report,
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
