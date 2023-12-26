import { combineReducers } from "redux";
import auth from "./authReducer";
import postDetail from "./postDetailReducer";
import sharePost from "./sharePostReducer";
import theme from "./themeReducer";
import homePosts from "./postReducer";
import notify from "./notifyReducer";
import addPostModal from "./addPostModalReducer";
import alert from "./alertReducer";
import suggest from "./suggestReducer";
import explore from "./exploreReducer";
import profile from "./profileReducer";
import socket from "./socketReducer";
import modal from "./modalReducer";
import message from "./messageReducer";
import online from "./onlineReducer";
import call from "./callReducer";
import peer from "./peerReducer";
export default combineReducers({
  auth,
  alert,
  postDetail,
  sharePost,
  theme,
  homePosts,
  notify,
  addPostModal,
  suggest,
  explore,
  profile,
  socket,
  modal,
  message,
  online,
  call,
  peer
});
