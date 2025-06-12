import { GLOBAL_TYPES } from "./globalTypes";
import { getDataAPI } from "../../utils/fetchData";

export const HOME_TYPES = {
  GET_CARDS_DATA: "GET_CARDS_DATA",
  GET_TOP_5_USERS: "GET_TOP_5_USERS",
  GET_CHART_STATISTICS: "GET_CHART_STATISTICS",
};

export const getCardsData =
  ({ interval = "7days", auth }) =>
  async (dispatch) => {
    let dateRage;

    switch (interval) {
      case "7days":
        dateRage = 7;
        break;
      case "30days":
        dateRage = 30;
        break;
      case "365days":
        dateRage = Math.floor(
          (new Date() - new Date(new Date().getFullYear(), 0, 1)) /
            (1000 * 60 * 60 * 24)
        );
        break;
      default:
        dateRage = 7;
    }

    try {
      const res = await getDataAPI(`home_info_cards/${dateRage}`, auth.token);
      const cardsData = [
        {
          value: res.data.newUsers.present,
          percent:
            res.data.newUsers.present > 0 &&
            res.data.newUsers.before > 0 &&
            Math.floor(
              ((res.data.newUsers.present - res.data.newUsers.before) /
                res.data.newUsers.before) *
                100
            ),
          gap: res.data.newUsers.present - res.data.newUsers.before,
          increase: res.data.newUsers.present - res.data.newUsers.before > 0,
        },
        {
          value: res.data.newPosts.present,
          percent:
            res.data.newPosts.present > 0 &&
            res.data.newPosts.before > 0 &&
            Math.floor(
              ((res.data.newPosts.present - res.data.newPosts.before) /
                res.data.newPosts.before) *
                100
            ),
          gap: res.data.newPosts.present - res.data.newPosts.before,
          increase: res.data.newPosts.present - res.data.newPosts.before > 0,
        },
        {
          value: res.data.newLikes.present,
          percent:
            res.data.newLikes.present > 0 &&
            res.data.newLikes.before > 0 &&
            Math.floor(
              ((res.data.newLikes.present - res.data.newLikes.before) /
                res.data.newLikes.before) *
                100
            ),
          gap: res.data.newLikes.present - res.data.newLikes.before,
          increase: res.data.newLikes.present - res.data.newLikes.before > 0,
        },
        {
          value: res.data.newReports.present,
          percent:
            res.data.newReports.present > 0 &&
            res.data.newReports.before > 0 &&
            Math.floor(
              ((res.data.newReports.present - res.data.newReports.before) /
                res.data.newReports.before) *
                100
            ),
          gap: res.data.newReports.present - res.data.newReports.before,
          increase:
            res.data.newReports.present - res.data.newReports.before > 0,
        },
      ];

      dispatch({
        type: HOME_TYPES.GET_CARDS_DATA,
        payload: cardsData,
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

export const getTop5Users =
  ({ auth }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI("top_5_users", auth.token);

      dispatch({
        type: HOME_TYPES.GET_TOP_5_USERS,
        payload: res.data.users,
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

export const get_chart_statistics =
  ({ auth }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI("statistic", auth.token);

      console.log(res.data);
      dispatch({
        type: HOME_TYPES.GET_CHART_STATISTICS,
        payload: res.data,
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
