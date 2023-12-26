import { GLOBAL_TYPES } from "../actions/globalTypes";

const initialState = false;

const postDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.POST_DETAIL:
      return action.payload;
    default:
      return state;
  }
};

export default postDetailReducer;
