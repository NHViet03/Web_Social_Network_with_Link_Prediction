import { NOTIFIES_TYPES } from "../actions/notifyAction";

const initialState = {
  notifies: [],
  loading: false,
};

const notifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFIES_TYPES.GET_NOTIFIES:
      return {
        ...state,
        notifies: action.payload,
        loading: true,
      };

    case NOTIFIES_TYPES.CREATE_NOTIFY:
      return {
        ...state,
        notifies: [action.payload, ...state.notifies],
      };

    case NOTIFIES_TYPES.REMOVE_NOTIFY:
      return {
        ...state,
        notifies: state.notifies.filter(
          (notify) =>
            notify.id !== action.payload.id || notify.url !== action.payload.url
        ),
      };
    case NOTIFIES_TYPES.UPDATE_NOTIFY:
      return {
        ...state,
        notifies: state.notifies.map((notify) =>
          notify._id === action.payload._id ? action.payload : notify
        ),
      };
    case NOTIFIES_TYPES.DELETE_ALL_NOTIFIES:
      return {
        ...state,
        notifies: action.payload,
      };
    default:
      return state;
  }
};

export default notifyReducer;
