import { SUGGEST_TYPES } from "../actions/suggestAction";

const initialState = {
  users:[],
  model: ""
};

const suggestReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUGGEST_TYPES.GET_USERS:
      return {
        ...state,
        users:action.payload.users,
        model:action.payload.model
      };
    default:
      return state;
  }
};

export default suggestReducer;
