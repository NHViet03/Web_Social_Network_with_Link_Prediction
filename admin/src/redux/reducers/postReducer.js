import { POST_TYPES } from "../actions/postAction";

const initialState = {
  posts: [],
  result: 0,
  totalPosts: 0,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_TYPES.GET_POSTS: {
      return {
        ...state,
        posts: action.payload.posts,
        result: action.payload.result,
        totalPosts: action.payload.totalPosts,
      };
    }
    default:
      return state;
  }
};

export default postReducer;
