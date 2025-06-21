import { POST_POOL_TYPES } from "../actions/postAction";

const initialState = {
  posts: [],
};

const postPoolReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_POOL_TYPES.CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case POST_POOL_TYPES.GET_POSTS:
      return {
        ...state,
        posts: action.payload.posts,
      };
    case POST_POOL_TYPES.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case POST_POOL_TYPES.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export default postPoolReducer;
