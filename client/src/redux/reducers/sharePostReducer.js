import {GLOBAL_TYPES} from '../actions/globalTypes';
const initialState = false;


const sharePostReducer =(state=initialState,action)=>{
    switch(action.type){
        case GLOBAL_TYPES.SHARE_POST:
            return action.payload;
        default:
            return state;
    }
}

export default sharePostReducer