import {GLOBAL_TYPES} from '../actions/globalTypes'
import {deleteDataAPI, getDataAPI, postDataAPI} from '../../utils/fetchData'
export const MESS_TYPES ={
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    UPDATE_MESSAGES: 'UPDATE_MESSAGES',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    CHECK_ONLINE_OFFLINE: 'CHECK_ONLINE_OFFLINE'
}

// export const addUser = ({user, message}) => (dispatch) => {
//     if(message.users.every(item=> item._id !==user._id)){
//         dispatch({
//             type: MESS_TYPES.ADD_USER,
//             payload: {...user, text: '', media: []}
//         })
//     }
// }

export const addMessage = ({msg, auth, socket}) => async (dispatch) => {
   dispatch({
       type: MESS_TYPES.ADD_MESSAGE,
       payload: msg
   })
   const { _id, avatar, fullname, username } = auth.user
   socket.emit('addMessage', {...msg, user: {_id, avatar, fullname, username}})
   try {
    await postDataAPI('message', msg, auth.token);
   } catch (err) {
     dispatch({
         type: GLOBAL_TYPES.ALERT,
         payload: {error: err.response.data.msg}
     })
   }
}

export const getConversations = ({auth, page = 1,mainBoxMessage}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`conversations?limit=${page * 9}`, auth.token);
        let newArr = [];
        res.data.conversations.forEach(item => {
           // item.recipientAccept is a key value object, get the value of the key that is equal to the auth.user._id
            const recipientAccept = item.recipientAccept[auth.user._id]
            item.recipients.forEach(cv => {
                if(cv._id !== auth.user._id){
                    newArr.push({...cv, text: item.text, media: item.media, recipientAccept: recipientAccept})
                }
            })
        })
        newArr = newArr.filter(item => item.recipientAccept === mainBoxMessage)
        dispatch({
                type: MESS_TYPES.GET_CONVERSATIONS,
                payload: {newArr, result: res.data.result}
            })
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getMessages = ({auth, id, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token);
        const newData = {...res.data, messages: res.data.messages.reverse()}
        dispatch({
            type: MESS_TYPES.GET_MESSAGES,
            payload: {...newData , _id: id, page}
            
        })
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

 export const loadMoreMessages = ({auth, id, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token);
        const newData = {...res.data, messages: res.data.messages.reverse()}
        dispatch({
            type: MESS_TYPES.UPDATE_MESSAGES,
            payload: {...newData , _id: id, page}
            
        })
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}   
export const deleteConversation = ({auth, id}) => async (dispatch) => {
    dispatch({
        type: MESS_TYPES.DELETE_CONVERSATION,
        payload: id
    })
    try {
        await deleteDataAPI(`conversation/${id}`, auth.token);
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}
