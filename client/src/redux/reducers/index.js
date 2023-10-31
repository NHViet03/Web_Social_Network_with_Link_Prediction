import { combineReducers } from "redux";
import auth from "./authReducer";
import postDetail from "./postDetailReducer";
import sharePost from "./sharePostReducer";
import theme from "./themeReducer";
import homePosts from './postReducer'

export default combineReducers({
  auth,
  postDetail,
  sharePost,
  theme,
  homePosts
});
