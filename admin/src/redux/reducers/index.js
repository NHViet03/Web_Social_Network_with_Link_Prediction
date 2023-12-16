import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from './alertReducer'
import loading from './loadingReducer'
import home from './homeReducer'
import postsData from './postReducer'
import usersData from './userReducer'

export default combineReducers({
  auth,
  loading,
  alert,
  home,
  postsData,
  usersData
});
