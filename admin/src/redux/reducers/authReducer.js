import { GLOBAL_TYPES } from "../actions/globalTypes";

const initialState = {
  token: "",
  user: {
    fullname: "Nguyễn Hoàng Việt",
    avatar:
      "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
  },
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default authReducer;
