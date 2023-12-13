import { GLOBAL_TYPES } from "../actions/globalTypes";

const initialState = false;

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.LOADING:
      return action.payload;
    default:
      return state;
  }
};

export default loadingReducer;
