import { EditData } from "../actions/globalTypes";
import { PROFILE_TYPES } from "../actions/profileAction";
const initialState = {
  loading: false,
  ids: [],
  users: [],
  posts: [],
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_TYPES.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case PROFILE_TYPES.GET_USER:
      return {
        ...state,
        users: [action.payload.user],
      };
    case PROFILE_TYPES.FOLLOW:
      return {
        ...state,
        users: EditData(state.users, action.payload._id, action.payload),
      };
    case PROFILE_TYPES.UNFOLLOW:
      return {
        ...state,
        users: EditData(state.users, action.payload._id, action.payload),
      };
    case PROFILE_TYPES.GET_ID:
      return {
        ...state,
        ids: [...state.ids, action.payload],
      };
    case PROFILE_TYPES.GET_POSTS:
      return {
        ...state,
        posts: [action.payload],
      };
    case PROFILE_TYPES.DELETE_POST_PROFILE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id
            ? {
                ...post,
                posts: post.posts.filter(
                  (item) => item._id !== action.payload.postId
                ),
              }
            : post
        ),
      };
    default:
      return state;
  }
};

export default profileReducer;
