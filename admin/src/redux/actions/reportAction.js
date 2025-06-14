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
        { status: "validated", deletePost: deletePost },
        auth.token
      );

      dispatch({
        type: REPORTS_TYPES.UPDATE_REPORT,
        payload: {
          ...report,
          status: "validated",
        },
      });
      dispatch({ type: GLOBAL_TYPES.LOADING, payload: false });

      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          type: "success",
          title: "Xác thực báo cáo thành công",
        },
      });
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
        { status: "rejected" }
      );
      dispatch({
        type: REPORTS_TYPES.UPDATE_REPORT,
        payload: {
          ...report,
          status: "rejected",
        },
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          type: "error",
          title: error.response?.data?.msg,
        },
      });
    }
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: false });
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
