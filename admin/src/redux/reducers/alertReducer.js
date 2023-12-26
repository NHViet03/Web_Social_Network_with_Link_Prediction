import { GLOBAL_TYPES } from "../actions/globalTypes";

const initialState = false;

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.ALERT:
      return action.payload;
    default:
      return state;
  }
};

export default alertReducer;
