import { GLOBAL_TYPES } from "../actions/globalTypes";

const initialState = false;

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.SOCKET:
      return action.payload;
    default:
      return state;
  }
};

export default socketReducer;
