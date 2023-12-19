import { MESS_TYPES } from "../actions/messageAction";
import { EditData } from "../actions/globalTypes";

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    firstLoad: false
}

const messageReducer = (state = initialState, action) =>{
    switch (action.type) {
        case MESS_TYPES.ADD_USER:
            return{
                ...state,
                users:[action.payload,...state.users]
            }
            case MESS_TYPES.ADD_MESSAGE:
                return{
                    ...state,
                    data :state.data.map(item => 
                        item._id === action.payload.recipient || item._id === action.payload.sender
                        ? {
                            ...item, 
                            messages: [...item.messages, action.payload],
                            result: item.result + 1
                        }
                        : item
                    ),
                    users: state.users.map(user => 
                        user._id === action.payload.recipient || user._id === action.payload.sender
                        ? {...user, text: action.payload.text, media: action.payload.media}
                        : user
                        )   
                }
            case MESS_TYPES.GET_CONVERSATIONS:
                return{
                    ...state,
                    users: action.payload.newArr,
                    resultUsers: action.payload.result,
                    firstLoad: true,
                    }
            case MESS_TYPES.GET_MESSAGES:
                return{
                    ...state,
                    data: [...state.data, action.payload],
                    }
            case MESS_TYPES.UPDATE_MESSAGES:
                return{
                    ...state,
                    data: EditData(state.data, action.payload._id, action.payload)
                    }
            default:
            return state;
    }
}

export default messageReducer; 