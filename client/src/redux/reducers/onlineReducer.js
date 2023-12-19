import { GLOBAL_TYPES } from "../actions/globalTypes";

const onlineReducer = (state = [], action) => {

    switch (action.type) {
        case GLOBAL_TYPES.ONLINE:
            return [...state, action.payload]
        case GLOBAL_TYPES.OFFLINE:
            return state.filter(item => item !== action.payload)
        default:
            return state;
    }
}

export default onlineReducer;