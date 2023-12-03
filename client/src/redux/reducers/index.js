import { combineReducers } from "redux";
import auth from "./authReducer";
import postDetail from "./postDetailReducer";
import sharePost from "./sharePostReducer";
import theme from "./themeReducer";
import profile from "./profileReducer";
import homePosts from './postReducer'
import notify from './notifyReducer'
import addPostModal from './addPostModalReducer'
import alert from "./alertReducer"

export default combineReducers({
  auth,
  alert,
  postDetail,
  sharePost,
  theme,
  homePosts,
  notify,
  addPostModal,
  profile,
});
