import { combineReducers } from "redux";
import auth from "./authReducer";
import postDetail from "./postDetailReducer";
import sharePost from "./sharePostReducer";
import theme from "./themeReducer";
import developer from "./developerReducer";
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
import searchHistory from "./searchHistoryReducer";
import postPool from "./postPoolReducer";

export default combineReducers({
  auth,
  alert,
  postDetail,
  sharePost,
  theme,
  developer,
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
  peer,
  searchHistory,
  postPool,
});
