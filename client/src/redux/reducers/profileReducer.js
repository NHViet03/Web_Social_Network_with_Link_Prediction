import { PROFILE_TYPES } from "../actions/profileAction";

const initialState = {
    loading : false,
    users: [],
    posts: []
}


const profileReducer = (state = initialState, action) =>{
    switch(action.type){
        case PROFILE_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case PROFILE_TYPES.GET_USER:
            console.log(action);
            return {
                ...state,
                users: [...state.users, action.payload.user]
            };
        default:
            return state;
    }
}

export default profileReducer;