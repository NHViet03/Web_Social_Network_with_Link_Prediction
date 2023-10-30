import { combineReducers } from "redux";
import auth from "./authReducer";
import postDetail from './postDetailReducer'

export default combineReducers({
    auth,
    postDetail
})