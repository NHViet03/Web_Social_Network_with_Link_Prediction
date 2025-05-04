import { SEARCH_TYPES } from "../actions/searchHistoryAction";
const initialState = {
  searchHistories: [],
};

const searchHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_TYPES.UPDATE_SEARCH:
    case SEARCH_TYPES.GET_SEARCHS:
      return {
        ...state,
        searchHistories: action.payload,
      };

    case SEARCH_TYPES.DELETE_SEARCH:
      return {
        ...state,
        searchHistories: state.searchHistories.filter(
          (history) => history._id !== action.payload
        ),
      };

    case SEARCH_TYPES.DELETE_ALL_SEARCH:
      return {
        ...state,
        searchHistories: [],
      };

    default:
      return state;
  }
};

export default searchHistoryReducer;
