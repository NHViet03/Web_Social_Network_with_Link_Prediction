import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from './alertReducer'
import loading from './loadingReducer'

export default combineReducers({
  auth,
  loading,
  alert
});
