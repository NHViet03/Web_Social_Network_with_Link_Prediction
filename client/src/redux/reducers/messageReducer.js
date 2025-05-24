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
    case MESS_TYPES.ADD_MESSAGE:
      return {
        ...state,
        data: state.data.map((item) => {
          //item._id (id1.id2) => split('.')
          const itemIDs = item._id.split(".");
          // nếu itemIDs chỉ có 1 phần tử thì push thêm action.payload.sender._id
          if (itemIDs.length === 1) {
            itemIDs.push(action.payload.sender._id);
          }
          // so sánh itemIDs với action.payload.recipients : có giống nhau theo đúng các phần tử không
          // nếu giống nhau thì push action.payload vào item.messages
          // nếu không giống nhau thì push action.payload vào item.messages
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
        }),
        users: state.users.map((user) => {
          const userIDs = user._id.split(".");
          // nếu itemIDs chỉ có 1 phần tử thì push thêm action.payload.sender._id
          if (userIDs.length === 1) {
            userIDs.push(action.payload.sender._id);
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
        }),
      };
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
