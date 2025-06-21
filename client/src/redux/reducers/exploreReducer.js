import { EXPLORE_TYPES } from "../actions/exploreAction";

const initialState = {
  posts: [],
  result: 0,
  firstLoad: false,
};

const exploreReducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPLORE_TYPES.GET_POSTS:
      return {
        ...state,
        posts: action.payload.posts,
        result: action.payload.result,
        firstLoad: true,
      };
    case EXPLORE_TYPES.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };

    case EXPLORE_TYPES.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export default exploreReducer;
