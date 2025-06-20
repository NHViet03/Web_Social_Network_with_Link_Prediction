import { GLOBAL_TYPES } from "../actions/globalTypes";
import {
  deleteDataAPI,
  getDataAPI,
  postDataAPI,
  putDataAPI,
} from "../../utils/fetchData";
import { imageGroupDefaultLink } from "../../utils/imageGroupDefaultLink";
export const MESS_TYPES = {
  ADD_USER: "ADD_USER",
  ADD_USER_SECOND: "ADD_USER_SECOND",
  ADD_MESSAGE: "ADD_MESSAGE",
  ADD_MESSAGE_SECOND: "ADD_MESSAGE_SECOND",
  GET_CONVERSATIONS: "GET_CONVERSATIONS",
  GET_MESSAGES: "GET_MESSAGES",
  ADD_GROUP_CHAT: "ADD_GROUP_CHAT",
  UPDATE_MESSAGES: "UPDATE_MESSAGES",
  DELETE_CONVERSATION: "DELETE_CONVERSATION",
  ACCEPT_CONVERSATION: "ACCEPT_CONVERSATION",
  CHECK_ONLINE_OFFLINE: "CHECK_ONLINE_OFFLINE",
  LOADINGCONVERSATIONS: "LOADING_CONVERSATIONS",
  MAINBOXMESSAGE: "MAINBOXMESSAGE",
  NUMBERNEWMESSAGE: "NUMBERNEWMESSAGE",
  NUMBERNEWMESSAGE_MINUS: "NUMBERNEWMESSAGE_MINUS",
  NUMBERNEWMESSAGE_ADD: "NUMBERNEWMESSAGE_ADD",
  READMESSAGE: "READMESSAGE",
  SOCKET_ISREADMESSAGE: "SOCKET_ISREADMESSAGE",
  REPLY_MESSAGE: "REPLY_MESSAGE",
  EDIT_MESSAGE: "EDIT_MESSAGE",
  EDIT_MESSAGE_SOCKET_FIRST: "EDIT_MESSAGE_SOCKET_FIRST",
  EDIT_MESSAGE_SOCKET_SECOND: "EDIT_MESSAGE_SOCKET_SECOND",
  REVOKE_MESSAGE_FIRST: "REVOKE_MESSAGE_FIRST",
  REVOKE_MESSAGE_SECOND: "REVOKE_MESSAGE_SECOND",
  MODAL_MANAGE_GROUP: "MODAL_MANAGE_GROUP",
  ALERT_IN_GROUP: "ALERT_IN_GROUP",
  REMOVE_USER_FROM_GROUP: "REMOVE_USER_FROM_GROUP",
  ADD_MEMBER_GROUP_CHAT: "ADD_MEMBER_GROUP_CHAT",
};

export const addMessage =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    dispatch({
      type: MESS_TYPES.ADD_MESSAGE,
      payload: msg,
    });

    try {
      const res = await postDataAPI("message", msg, auth.token);
      socket.emit("addMessage", { ...msg });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

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
          const nameGroup = item.recipients.map((cv) => cv.username).join(", ");
          newArr.push({
            avatar: imageGroupDefaultLink,
            _id: item._id,
            fullname: nameGroup,
            username: nameGroup,
            text: item.text,
            media: item.media,
            isVisible: item.isVisible,
            recipientAccept: item.recipientAccept,
            isRead: item.isRead,
            isGroup: item.isGroup,
            recipients: item.recipients,
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

export const acceptConversation =
  ({ auth, listID, id }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: MESS_TYPES.ACCEPT_CONVERSATION,
        payload: { _id: id },
      });
      await putDataAPI("accept-conversation", { listID }, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const getMessages =
  ({ auth, id, page = 1, conversation }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `message/${id}?limit=${page * 9}&isGroup=${
          conversation.isGroup
        }&conversationID=${conversation._id}`,
        auth.token
      );
      // filter những res.data.messages với isVisible[auth.user._id] = true
      const newArr = res.data.messages
        .filter((item) => item.isVisible[auth.user._id] === true)
        .reverse();
      const newData = { ...res.data, messages: newArr };

      dispatch({
        type: MESS_TYPES.GET_MESSAGES,
        payload: { ...newData, _id: id, page },
      });
    } catch (err) {
      console.error("Lỗi khi lấy tin nhắn:", err);
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err?.response?.data.msg },
      });
    }
  };

export const loadMoreMessages =
  ({ auth, id, page = 1 }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `message/${id}?limit=${page * 9}`,
        auth.token
      );
      const newData = { ...res.data, messages: res.data.messages.reverse() };
      dispatch({
        type: MESS_TYPES.UPDATE_MESSAGES,
        payload: { ...newData, _id: id, page },
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };
export const deleteConversation =
  ({ auth, id }) =>
  async (dispatch) => {
    dispatch({
      type: MESS_TYPES.DELETE_CONVERSATION,
      payload: id,
    });
    try {
      await deleteDataAPI(`conversation/${id}`, auth.token);
    } catch (err) {
      if (err.response.status !== 404) {
        dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: { error: err.response.data.msg },
        });
      }
    }
  };

export const revokeMessage =
  ({ auth, msg, socket }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: MESS_TYPES.REVOKE_MESSAGE_FIRST,
        payload: msg,
      });
      await putDataAPI(`revokeMessage/${msg._id}`, { auth, msg }, auth.token);
      socket.emit("revokeMessage", msg);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const editMessage =
  ({ auth, msg, textEdit, socket }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: MESS_TYPES.EDIT_MESSAGE,
        payload: null,
      });
      dispatch({
        type: MESS_TYPES.EDIT_MESSAGE_SOCKET_FIRST,
        payload: { ...msg, textEdit },
      });
      await putDataAPI(`editMessage/${msg._id}`, { textEdit }, auth.token);
      socket.emit("editMessage", { ...msg, textEdit });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const removeAdminGroup =
  ({ userId, conversationId, auth, socket }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { loading: true },
      });
      const res = await putDataAPI(
        `remove-admin-group/${conversationId}`,
        { userId },
        auth.token
      );
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { loading: false },
      });
      socket.emit("updateManagerGroup", {
        userId: auth.user._id,
        conversation: res.data.conversation,
      });
      dispatch({
        type: MESS_TYPES.MODAL_MANAGE_GROUP,
        payload: res.data.conversation,
      });
      dispatch({
        type: MESS_TYPES.ALERT_IN_GROUP,
        payload: res.data.conversation,
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const setAdminGroup =
  ({ userId, conversationId, auth, socket }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { loading: true },
      });
      const res = await putDataAPI(
        `set-admin-group/${conversationId}`,
        { userId },
        auth.token
      );
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { loading: false },
      });
      dispatch({
        type: MESS_TYPES.MODAL_MANAGE_GROUP,
        payload: res.data.conversation,
      });
      dispatch({
        type: MESS_TYPES.ALERT_IN_GROUP,
        payload: res.data.conversation,
      });
      socket.emit("updateManagerGroup", {
        userId: auth.user._id,
        conversation: res.data.conversation,
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const removeUserFromGroupChat =
  ({ userId, conversationId, auth, socket }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { loading: true },
      });
      const res = await putDataAPI(
        `delete-user-group/${conversationId}`,
        { userId },
        auth.token
      );
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { loading: false },
      });
      dispatch({
        type: MESS_TYPES.MODAL_MANAGE_GROUP,
        payload: res.data.conversation,
      });
      dispatch({
        type: MESS_TYPES.ALERT_IN_GROUP,
        payload: res.data.conversation,
      });
      socket.emit("removeUserFromGroup", {
        userId: userId,
        recepientsBeforeDelete: res.data.recepientsBeforeDelete,
        conversation: res.data.conversation,
        authUserId: auth.user._id,
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const leaveGroupChat =
  ({ conversationId, auth, socket }) =>
  async (dispatch) => {
    try {
      const res = await putDataAPI(
        `leave-group/${conversationId}`,
        { userId: auth.user._id },
        auth.token
      );
      dispatch({
        type: MESS_TYPES.MODAL_MANAGE_GROUP,
        payload: null,
      });
      dispatch({
        type: MESS_TYPES.REMOVE_USER_FROM_GROUP,
        payload: res.data.conversation,
      });
      socket.emit("leaveGroupChat", {
        authUserId: auth.user._id,
        recepientsBeforeDelete: res.data.recepientsBeforeDelete,
        conversation: res.data.conversation,
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const addMemberGroupChat =
  ({ groupUsersChat, conversationId, auth, socket }) =>
  async (dispatch) => {
    try {
      const listIdUserAdd = groupUsersChat.map((user) => user._id);
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { loading: true },
      });
      const res = await postDataAPI(
        "add-member-group-chat",
        { listIdUserAdd, conversationId },
        auth.token
      );
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { loading: false },
      });
      dispatch({
        type: MESS_TYPES.MODAL_MANAGE_GROUP,
        payload: null,
      });
      dispatch({
        type: MESS_TYPES.ALERT_IN_GROUP,
        payload: res.data.conversation,
      });
      socket.emit("addMemberGroupChat", {
        conversation: res.data.conversation,
        authUserId: auth.user._id,
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };
