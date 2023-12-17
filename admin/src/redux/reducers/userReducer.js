import { USER_TYPES } from "../actions/userAction";

const initialState = {
  users: [],
  result: 0,
  totalUsers: 0,
  firstLoad: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_TYPES.GET_USERS: {
      return {
        ...state,
        users: action.payload.users,
        result: action.payload.result,
        totalUsers: action.payload.totalUsers,
        firstLoad: true,
      };
    }
    case USER_TYPES.FIRST_LOAD: {
      return {
        ...state,
        firstLoad: action.payload,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
