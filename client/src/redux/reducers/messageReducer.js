import { MESS_TYPES } from "../actions/messageAction";
import { EditData, DeleteData } from "../actions/globalTypes";
import { arraysEqualIgnoreOrder } from "../../utils/helper";

const initialState = {
  users: [],
  resultUsers: 0,
  data: [],
  firstLoad: false,
  loadingConversation: false,
  mainBoxMessage: true,
  numberNewMessage: 0,
  replyMessage: null,
  editMessage: null,
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESS_TYPES.ADD_USER:
      if (state.users.every((item) => item._id !== action.payload._id)) {
        return {
          ...state,
          users: [action.payload, ...state.users],
        };
      }
      return state;
    case MESS_TYPES.ADD_MESSAGE: {
      // Cập nhật mảng data
      const updatedData = state.data.map((item) => {
        let itemIDs = item._id.split(".");
        if (itemIDs.length === 1 && itemIDs[0] !== action.payload.sender._id) {
          itemIDs.push(action.payload.sender._id);
        } else if (itemIDs.length === 1 && itemIDs[0] === action.payload.sender._id)
        {
            itemIDs = action.payload.recipients;
        }

        const recipientsMatch = arraysEqualIgnoreOrder(
          itemIDs,
          action.payload.recipients
        );

        if (recipientsMatch) {
          return {
            ...item,
            messages: [...item.messages, action.payload],
            result: item.result + 1,
          };
        }

        return item;
      });

      // Cập nhật từng user
      const updatedUsers = state.users.map((user) => {
        let userIDs = user._id.split(".");
         if (userIDs.length === 1 && userIDs[0] !== action.payload.sender._id) {
           userIDs.push(action.payload.sender._id);
         } else if (
           userIDs.length === 1 &&
           userIDs[0] === action.payload.sender._id
         ) {
           userIDs =  action.payload.recipients;
         }

        const recipientsMatch = arraysEqualIgnoreOrder(
          userIDs,
          action.payload.recipients
        );

        if (recipientsMatch) {
          return {
            ...user,
            text: action.payload.text,
            media: action.payload.media,
          };
        }

        return user;
      });

      // Tìm user vừa được cập nhật
      const matchedUser = updatedUsers.find((user) => {
        const userIDs = user._id.split(".");
        if (userIDs.length === 1) {
          userIDs.push(action.payload.sender._id);
        }

        return arraysEqualIgnoreOrder(userIDs, action.payload.recipients);
      });

      // Đưa user đó lên đầu
      const reorderedUsers = matchedUser
        ? [matchedUser, ...updatedUsers.filter((u) => u !== matchedUser)]
        : updatedUsers;

      return {
        ...state,
        data: updatedData,
        users: reorderedUsers,
      };
    }

    case MESS_TYPES.GET_CONVERSATIONS:
      return {
        ...state,
        users: action.payload.newArr,
        resultUsers: action.payload.result,
        firstLoad: true,
      };
    case MESS_TYPES.GET_MESSAGES:
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case MESS_TYPES.UPDATE_MESSAGES:
      return {
        ...state,
        data: EditData(state.data, action.payload._id, action.payload),
      };
    case MESS_TYPES.DELETE_CONVERSATION:
      return {
        ...state,
        users: DeleteData(state.users, action.payload),
        data: DeleteData(state.data, action.payload),
      };
    case MESS_TYPES.LOADINGCONVERSATIONS:
      return {
        ...state,
        loadingConversation: action.payload,
      };
    case MESS_TYPES.MAINBOXMESSAGE:
      return {
        ...state,
        mainBoxMessage: action.payload,
      };
    case MESS_TYPES.NUMBERNEWMESSAGE:
      return {
        ...state,
        numberNewMessage: action.payload,
      };
    case MESS_TYPES.SOCKET_ISREADMESSAGE:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload.sender
            ? { ...user, isRead: action.payload.isRead }
            : user
        ),
      };
    case MESS_TYPES.READMESSAGE:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload.id
            ? { ...user, isRead: action.payload.isRead }
            : user
        ),
      };
    case MESS_TYPES.REPLY_MESSAGE:
      return {
        ...state,
        replyMessage: action.payload,
      };
    case MESS_TYPES.EDIT_MESSAGE:
      return {
        ...state,
        editMessage: action.payload,
      };
    case MESS_TYPES.CHECK_ONLINE_OFFLINE:
      return {
        ...state,
        users: state.users.map((user) =>
          action.payload.includes(user._id)
            ? { ...user, online: true }
            : { ...user, online: false }
        ),
      };
    default:
      return state;
  }
};

export default messageReducer;
