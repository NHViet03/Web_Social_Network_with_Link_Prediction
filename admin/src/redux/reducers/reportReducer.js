import { REPORTS_TYPES } from "../actions/reportAction";

const initialState = {
  reports: [],
  result: 0,
  totalReports: 0,
  firstLoad: false,
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case REPORTS_TYPES.GET_REPORTS: {
      return {
        ...state,
        reports: action.payload.reports,
        result: action.payload.result,
        totalReports: action.payload.totalReports,
        firstLoad: true,
      };
    }
    case REPORTS_TYPES.UPDATE_REPORT: {
      return {
        ...state,
        reports: state.reports.map((report) =>
          report._id === action.payload._id ? action.payload : report
        ),
      };
    }
    case REPORTS_TYPES.DELETE_REPORT: {
      return {
        ...state,
        reports: state.reports.filter(
          (report) => report._id !== action.payload._id
        ),
        result: state.result - 1,
        totalReports: state.totalReports - 1,
      };
    }
    case REPORTS_TYPES.FIRST_LOAD: {
      return {
        ...state,
        firstLoad: action.payload,
      };
    }
    default:
      return state;
  }
};

export default reportReducer;
