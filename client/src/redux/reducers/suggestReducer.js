import { SUGGEST_TYPES } from "../actions/suggestAction";

const initialState = {
  users:[]
};

const suggestReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUGGEST_TYPES.GET_USERS:
      return {
        ...state,
        users:action.payload
      };
    default:
      return state;
  }
};

export default suggestReducer;
