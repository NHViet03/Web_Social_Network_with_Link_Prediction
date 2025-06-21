import { GLOBAL_TYPES } from "./globalTypes";
import {
  postDataAPI,
  getDataAPI,
  patchDataAPI,
  deleteDataAPI,
} from "../../utils/fetchData";

export const SEARCH_TYPES = {
  UPDATE_SEARCH: "UPDATE_SEARCH",
  GET_SEARCHS: "GET_SEARCHS",
  DELETE_SEARCH: "DELETE_SEARCH",
  DELETE_ALL_SEARCH: "DELETE_ALL_SEARCH",
};

export const getSearchHistories = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI("search_history", token);

    dispatch({
      type: SEARCH_TYPES.GET_SEARCHS,
      payload: res.data.data,
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

export const updateSearchHistory =
  ({ result, token }) =>
  async (dispatch) => {
    try {
      const res = await postDataAPI(
        "search_history/update",
        {
          result,
        },
        token
      );

      dispatch({
        type: SEARCH_TYPES.UPDATE_SEARCH,
        payload: res.data.data,
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

export const deleteSearchHistory =
  ({ id, token }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: SEARCH_TYPES.DELETE_SEARCH,
        payload: id,
      });

      await patchDataAPI(`search_history/${id}`, null, token);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const deleteAllSearchHistory =
  ({ token }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: SEARCH_TYPES.DELETE_ALL_SEARCH,
        payload: null,
      });

      await deleteDataAPI(`search_history`, token);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };
