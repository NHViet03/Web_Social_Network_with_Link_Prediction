import {GLOBAL_TYPES} from '../actions/globalTypes'
import {deleteDataAPI, getDataAPI, postDataAPI, putDataAPI} from '../../utils/fetchData'
import {imageGroupDefaultLink} from '../../utils/imageGroupDefaultLink'
export const MESS_TYPES ={
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    UPDATE_MESSAGES: 'UPDATE_MESSAGES',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    CHECK_ONLINE_OFFLINE: 'CHECK_ONLINE_OFFLINE',
    LOADINGCONVERSATIONS: 'LOADING_CONVERSATIONS',
    MAINBOXMESSAGE : 'MAINBOXMESSAGE',
    NUMBERNEWMESSAGE: 'NUMBERNEWMESSAGE',
    READMESSAGE: 'READMESSAGE',
    SOCKET_ISREADMESSAGE: 'SOCKET_ISREADMESSAGE',
}

export const addMessage = ({msg, auth, socket}) => async (dispatch) => {
   dispatch({
       type: MESS_TYPES.ADD_MESSAGE,
       payload: msg
   })
   const { _id, avatar, fullname, username } = auth.user
   
   try {
    const res = await postDataAPI('message', msg, auth.token);
    socket.emit('addMessage', {...msg, user: {_id, avatar, fullname, username}})
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
        `conversations?limit=${page * 50}&mainBoxMessage=${mainBoxMessage}`,
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

            // hard code
            recipientAccept: true,
            isRead: true,
            isGroup: item.isGroup,
          });
        } else {
          item.recipients.forEach((cv) => {
            if (cv._id !== auth.user._id) {
              newArr.push({
                ...cv,
                text: item.text,
                media: item.media,

                // hard code
                recipientAccept: true,
                isRead: true,
                isGroup: item.isGroup,
              });
            }
          });
        }
      });

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


export const acceptConversation = ({auth, id}) => async (dispatch) => {
    try {
     await putDataAPI('accept-conversation', {auth,id}, auth.token);

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
        console.log(res.data)
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
