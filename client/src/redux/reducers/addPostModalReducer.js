import { GLOBAL_TYPES } from "../actions/globalTypes";

const initialState = false;

const addPostModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.ADD_POST_MODAL:
      return action.payload;
    default:
      return state;
  }
};

export default addPostModalReducer;
