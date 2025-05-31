import {GLOBAL_TYPES} from '../actions/globalTypes'
import {deleteDataAPI, getDataAPI, postDataAPI, putDataAPI} from '../../utils/fetchData'
import {imageGroupDefaultLink} from '../../utils/imageGroupDefaultLink'
export const MESS_TYPES ={
    ADD_USER: 'ADD_USER',
    ADD_USER_SECOND: 'ADD_USER_SECOND',
    ADD_MESSAGE: 'ADD_MESSAGE',
    ADD_MESSAGE_SECOND: 'ADD_MESSAGE_SECOND',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    UPDATE_MESSAGES: 'UPDATE_MESSAGES',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    ACCEPT_CONVERSATION: 'ACCEPT_CONVERSATION',
    CHECK_ONLINE_OFFLINE: 'CHECK_ONLINE_OFFLINE',
    LOADINGCONVERSATIONS: 'LOADING_CONVERSATIONS',
    MAINBOXMESSAGE : 'MAINBOXMESSAGE',
    NUMBERNEWMESSAGE: 'NUMBERNEWMESSAGE',
    NUMBERNEWMESSAGE_MINUS: 'NUMBERNEWMESSAGE_MINUS',
    READMESSAGE: 'READMESSAGE',
    SOCKET_ISREADMESSAGE: 'SOCKET_ISREADMESSAGE',
    REPLY_MESSAGE: 'REPLY_MESSAGE',
    EDIT_MESSAGE: 'EDIT_MESSAGE',
    EDIT_MESSAGE_SOCKET_FIRST: 'EDIT_MESSAGE_SOCKET_FIRST',
    EDIT_MESSAGE_SOCKET_SECOND: 'EDIT_MESSAGE_SOCKET_SECOND',
    REVOKE_MESSAGE_FIRST: 'REVOKE_MESSAGE_FIRST',
    REVOKE_MESSAGE_SECOND: 'REVOKE_MESSAGE_SECOND',
}

export const addMessage = ({msg, auth, socket}) => async (dispatch) => {

   dispatch({
       type: MESS_TYPES.ADD_MESSAGE,
       payload: msg
   })
   
   try {
    const res = await postDataAPI('message', msg, auth.token);
      socket.emit('addMessage', {...msg})
   } catch (err) {
     dispatch({
         type: GLOBAL_TYPES.ALERT,
         payload: {error: err.response.data.msg}
     })
   }
}

export const getConversations =
  ({ auth, page = 1, mainBoxMessage }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: MESS_TYPES.LOADINGCONVERSATIONS,
        payload: true,
      });
      const res = await getDataAPI(
        `conversations?limit=${page * 20}&mainBoxMessage=${mainBoxMessage}`,
        auth.token
      );
      let newArr = [];
      res.data.conversations.forEach((item) => {
        if (item.isGroup) {
          const id = item.recipients.map((cv) => cv._id).join(".");
          const nameGroup = item.recipients.map((cv) => cv.username).join(", ")
          newArr.push({
            avatar: imageGroupDefaultLink,
            _id: id,
            fullname: nameGroup,
            username: nameGroup,
            text: item.text,
            media: item.media,
            isVisible: item.isVisible,
            recipientAccept: item.recipientAccept,
            isRead: item.isRead,
            isGroup: item.isGroup,
          });
        } else {
          item.recipients.forEach((cv) => {
            if (cv._id !== auth.user._id) {
              newArr.push({
                ...cv,
                text: item.text,
                media: item.media,
                isVisible: item.isVisible, 
                recipientAccept: item.recipientAccept,
                isRead: item.isRead,
                isGroup: item.isGroup,
              });
            }
          });
        }
      });
      // // filter những cuộc hội thoại không có tin nhắn (isVisible[auth.user._id] = false)
      newArr = newArr.filter((item) => item.isVisible[auth.user._id] === true);

      dispatch({
        type: MESS_TYPES.GET_CONVERSATIONS,
        payload: { newArr, result: res.data.result },
      });
      dispatch({
        type: MESS_TYPES.LOADINGCONVERSATIONS,
        payload: false,
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };


export const acceptConversation = ({auth, listID,id}) => async (dispatch) => {
    try {
        dispatch({
            type: MESS_TYPES.ACCEPT_CONVERSATION,
            payload: {_id: id}
        })
     await putDataAPI('accept-conversation', {listID}, auth.token);

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
        // filter những res.data.messages với isVisible[auth.user._id] = true
        const newArr = res.data.messages.filter((item) => item.isVisible[auth.user._id] === true).reverse()
        const newData = {...res.data, messages: newArr}
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

export const revokeMessage = ({auth, msg, socket}) => async (dispatch) => {
 
    try {
      dispatch({
          type: MESS_TYPES.REVOKE_MESSAGE_FIRST,
          payload: msg
      })
        await putDataAPI(`revokeMessage/${msg._id}`, {auth, msg}, auth.token);
         socket.emit('revokeMessage', msg)
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const editMessage = ({auth, msg, textEdit, socket}) => async (dispatch) => {

    try {
       dispatch({
            type: MESS_TYPES.EDIT_MESSAGE,
            payload: null
        })
        dispatch({
            type: MESS_TYPES.EDIT_MESSAGE_SOCKET_FIRST,
            payload: {...msg, textEdit}
        })
        await putDataAPI(`editMessage/${msg._id}`, {textEdit}, auth.token);
       socket.emit('editMessage', {...msg, textEdit})
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}
