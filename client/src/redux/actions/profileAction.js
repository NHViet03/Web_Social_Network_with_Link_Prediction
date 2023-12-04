import { GLOBAL_TYPES } from "./globalTypes";
import { getDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";

export const PROFILE_TYPES = {
    LOADING: "LOADING",
    GET_USER: "GET_USER",
}

export const getProfileUsers = ({users, id, auth}) => async (dispatch) => {
    // console.log( "User: " +users, "...ID  " + id, auth)
    if(users.every(user => user._id !== id)){
        try {
           dispatch({type: PROFILE_TYPES.LOADING, payload: true})
           const res = await getDataAPI(`/user/${id}`, auth.token)

           dispatch({type: PROFILE_TYPES.GET_USER, payload: res.data})
           dispatch({type: PROFILE_TYPES.LOADING, payload: false})
        } catch (err) {
            dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
        }
    }
}

export const updateProfileUsers = ({userData, avatar}) => async (dispatch) => {
    if(!userData.fullname)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: "Vui lòng nhập tên."}})

    if(userData.fullname.length > 25)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: "Tên không được vượt quá 25 ký tự."}})

    if(!userData.username)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: "Vui lòng nhập tên người dùng."}})

    if(userData.username.length > 25)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: "Tên người dùng không được vượt quá 25 ký tự."}})

    if(userData.story.length > 200)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: "Tiểu sử không được vượt quá 200 ký tự."}})

    try {
        let media;
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {loading: true}})
        if(avatar) media = await imageUpload([avatar])
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {loading: false}})

    }catch(err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }

}