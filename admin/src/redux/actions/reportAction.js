import { GLOBAL_TYPES } from "./globalTypes";
import {
  getDataAPI,
  postDataAPI,
  deleteDataAPI,
  patchDataAPI,
} from "../../utils/fetchData";

export const REPORTS_TYPES = {
  GET_REPORTS: "GET_REPORTS",
  UPDATE_REPORT: "UPDATE_REPORT",
  DELETE_REPORT: "DELETE_REPORT",
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
  ({ report, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GLOBAL_TYPES.LOADING, payload: true });
      await patchDataAPI(
        `admin/report/${report._id}`,
        { status: "validated" },
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
