import { MESS_TYPES } from "../actions/messageAction";
import { EditData, DeleteData } from "../actions/globalTypes";
import { arraysEqualIgnoreOrder, checkMapTrue } from "../../utils/helper";
import { imageGroupDefaultLink } from "../../utils/imageGroupDefaultLink";

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
  modalManageGroup: null,
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
    case MESS_TYPES.ADD_USER_SECOND: {
      const newUser = {
        _id: action.payload.recipients.join("."),
        avatar: action.payload.conversation.isGroup
          ? imageGroupDefaultLink
          : action.payload.sender.avatar,
        fullname: action.payload.conversation.isGroup
          ? action.payload.nameGroup
          : action.payload.sender.fullname,
        username: action.payload.conversation.isGroup
          ? action.payload.nameGroup
          : action.payload.sender.username,
        text: action.payload.text,
        media: action.payload.media,
        isVisible: action.payload.conversation.isVisible,
        recipientAccept: action.payload.conversation.recipientAccept,
        isRead: action.payload.conversation.isRead,
        isGroup: action.payload.conversation.isGroup,
      };

      // Kiểm tra tất cả users trong danh sách với action.payload.recipients, nếu check bằng false thì thêm user mới
      let isUserExists = false;
      state.users.forEach((user) => {
        let userIDs = user._id.split(".");
        if (
          userIDs.length === 1 &&
          userIDs[0] === action.payload.sender._id &&
          action.payload.recipients.length === 2
        ) {
          userIDs = [...action.payload.recipients];
        }
        if (arraysEqualIgnoreOrder(userIDs, action.payload.recipients)) {
          isUserExists = true;
        }
      });
      if (!isUserExists) {
        return {
          ...state,
          users: [newUser, ...state.users],
        };
      }
      return state;
    }
    case MESS_TYPES.ADD_MESSAGE: {
      // Cập nhật mảng data
      const updatedData = state.data.map((item) => {
        let itemIDs = item._id.split(".");
        if (itemIDs.length === 1 && itemIDs[0] !== action.payload.sender._id) {
          itemIDs.push(action.payload.sender._id);
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
    case MESS_TYPES.ADD_MESSAGE_SECOND: {
      // Cập nhật mảng data
      const updatedData = state.data.map((item) => {
        let itemIDs = item._id.split(".");
        if (
          itemIDs.length === 1 &&
          action.payload.recipients.length == 2 &&
          itemIDs[0] === action.payload.sender._id
        ) {
          itemIDs = [...action.payload.recipients];
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

        if (
          userIDs.length === 1 &&
          action.payload.recipients.length === 2 &&
          userIDs[0] === action.payload.sender._id
        ) {
          userIDs = [...action.payload.recipients];
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
            isRead: {
              ...action.payload.recipients.reduce((acc, recipient) => {
                acc[recipient] = false;
                return acc;
              }, {}),
            },
          };
        }

        return user;
      });

      // Tìm user vừa được cập nhật
      const matchedUser = updatedUsers.find((user) => {
        let userIDs = user._id.split(".");
        if (
          userIDs.length === 1 &&
          action.payload.recipients.length === 2 &&
          userIDs[0] === action.payload.sender._id
        ) {
          userIDs = [...action.payload.recipients];
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
        data: [action.payload],
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
    case MESS_TYPES.ACCEPT_CONVERSATION:
      return {
        ...state,
        //Filter user có _id có action.payload
        users: state.users.filter((user) => user._id !== action.payload._id),
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
    case MESS_TYPES.NUMBERNEWMESSAGE_MINUS:
      // Lặp qua tưng user trong state.users
      const user = state.users.find((user) =>
        arraysEqualIgnoreOrder(user._id.split("."), action.payload.listID)
      );
      // Nếu tìm thấy user, kiểm tra xem user.isRead có chứa action.payload.userID = false không
      if (user && !checkMapTrue(action.payload.userID, user.isRead)) {
        // trả về state với numberNewMessage giảm đi 1
        return {
          ...state,
          numberNewMessage: state.numberNewMessage - 1,
        };
      }
      // Nếu không tìm thấy user hoặc user.isRead chứa action.payload.userID = true, không làm gì cả
      return state;
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
      let shouldDecrease = false;

      const updatedUsers = state.users.map((user) => {
        if (user._id === action.payload.id) {
          shouldDecrease = true;
          return {
            ...user,
            isRead: {
              ...user.isRead,
              [action.payload.userId]: true,
            },
          };
        }
        return user;
      });

      return {
        ...state,
        users: updatedUsers,
        numberNewMessage: shouldDecrease
          ? Math.max(state.numberNewMessage - 1, 0)
          : state.numberNewMessage,
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
    case MESS_TYPES.EDIT_MESSAGE_SOCKET_FIRST:
      console.log("EDIT_MESSAGE_SOCKET_FIRST", action.payload);
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.conversation.idPath
            ? {
                ...item,
                messages: item.messages.map((msg) => {
                  // Logic 1: Cập nhật chính tin nhắn bị sửa
                  if (msg._id === action.payload._id) {
                    return {
                      ...msg,
                      text: action.payload.textEdit,
                      isEdit: true,
                    };
                  }

                  // Logic 2: Nếu là tin nhắn trả lời và replymessage._id trùng
                  if (
                    msg.replymessage &&
                    msg.replymessage._id === action.payload._id
                  ) {
                    return {
                      ...msg,
                      replymessage: {
                        ...msg.replymessage,
                        text: action.payload.textEdit, // giả sử muốn cập nhật text của replyMessage luôn
                      },
                    };
                  }

                  // Không thay đổi
                  return msg;
                }),
              }
            : item
        ),
      };
    case MESS_TYPES.EDIT_MESSAGE_SOCKET_SECOND:
      let listID = action.payload.conversation.idPath.split(".");
      if (listID.length === 1) {
        listID[0] = action.payload.sender._id;
      }
      return {
        ...state,
        data: state.data.map((item) => {
          const listIDItem = item._id.split(".");
          const checkListID = arraysEqualIgnoreOrder(listIDItem, listID);
          if (checkListID) {
            return {
              ...item,
              messages: item.messages.map((msg) => {
                // Logic 1: Cập nhật chính tin nhắn bị sửa
                if (msg._id === action.payload._id) {
                  return {
                    ...msg,
                    text: action.payload.textEdit,
                    isEdit: true,
                  };
                }

                // Logic 2: Nếu là tin nhắn trả lời và replymessage._id trùng
                if (
                  msg.replymessage &&
                  msg.replymessage._id === action.payload._id
                ) {
                  return {
                    ...msg,
                    replymessage: {
                      ...msg.replymessage,
                      text: action.payload.textEdit, // giả sử muốn cập nhật text của replyMessage luôn
                    },
                  };
                }

                // Không thay đổi
                return msg;
              }),
            };
          }
          return item;
          //   ? {
          //       ...item,
          //       messages: item.messages.map((msg) =>
          //         msg._id === action.payload._id
          //           ? {
          //               ...msg,
          //               text: action.payload.textEdit,
          //               isEdit: true,
          //             }
          //           : msg
          //       ),
          //     }
          //   : item
        }),
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
    case MESS_TYPES.REVOKE_MESSAGE_FIRST:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.conversation.idPath
            ? {
                ...item,
                messages: item.messages.map((msg) => {
                  // 1. Tin nhắn bị thu hồi
                  if (msg._id === action.payload._id) {
                    return {
                      ...msg,
                      isRevoke: true,
                    };
                  }

                  // 2. Tin nhắn khác có replymessage trỏ đến tin nhắn bị thu hồi
                  if (
                    msg.replymessage &&
                    msg.replymessage._id === action.payload._id
                  ) {
                    return {
                      ...msg,
                      replymessage: {
                        ...msg.replymessage,
                        isRevoke: true,
                      },
                    };
                  }

                  return msg;
                }),
              }
            : item
        ),
      };
    case MESS_TYPES.REVOKE_MESSAGE_SECOND:
      let listIDRevoke = action.payload.conversation.idPath.split(".");
      if (listIDRevoke.length === 1) {
        listIDRevoke[0] = action.payload.sender._id;
      }
      return {
        ...state,
        data: state.data.map((item) => {
          const listIDItem = item._id.split(".");
          const checkListID = arraysEqualIgnoreOrder(listIDItem, listIDRevoke);

          if (checkListID) {
            return {
              ...item,
              messages: item.messages.map((msg) => {
                // 1. Tin nhắn bị thu hồi
                if (msg._id === action.payload._id) {
                  return {
                    ...msg,
                    isRevoke: true,
                  };
                }

                // 2. Tin nhắn có replymessage trỏ đến tin nhắn bị thu hồi
                if (
                  msg.replymessage &&
                  msg.replymessage._id === action.payload._id
                ) {
                  return {
                    ...msg,
                    replymessage: {
                      ...msg.replymessage,
                      isRevoke: true,
                    },
                  };
                }

                return msg;
              }),
            };
          }

          return item;
        }),
      };
    case MESS_TYPES.MODAL_MANAGE_GROUP:
      return {
        ...state,
        modalManageGroup: action.payload,
      };
    default:
      return state;
  }
};

export default messageReducer;
