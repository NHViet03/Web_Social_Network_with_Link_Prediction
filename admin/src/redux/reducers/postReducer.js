import { POST_TYPES } from "../actions/postAction";

const initialState = {
  posts: [],
  result: 0,
  totalPosts: 0,
  firstLoad: false,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_TYPES.GET_POSTS: {
      return {
        ...state,
        posts: action.payload.posts,
        result: action.payload.result,
        totalPosts: action.payload.totalPosts,
        firstLoad: true,
      };
    }
    case POST_TYPES.FIRST_LOAD: {
      return {
        ...state,
        firstLoad: action.payload,
      };
    }
    default:
      return state;
  }
};

export default postReducer;
