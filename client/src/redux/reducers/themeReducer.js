import { GLOBAL_TYPES } from "../actions/globalTypes";
const initialState = false;

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.THEME:
      return action.payload;
    default:
      return state;
  }
};

export default themeReducer;
