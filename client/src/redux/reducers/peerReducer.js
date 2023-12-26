import { GLOBAL_TYPES } from "../actions/globalTypes";


const peerReducer = (state = null , action) =>{
    switch(action.type){
        case GLOBAL_TYPES.PEER:
            return action.payload;
        default:
            return state;
    }
}

export default peerReducer