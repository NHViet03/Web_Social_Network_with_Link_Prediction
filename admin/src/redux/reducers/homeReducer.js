import { HOME_TYPES } from "../actions/homeAction";

const initialState = {
  cardsData: [
    {
      title: "Người dùng mới",
      value: 0,
      percent: 0,
      gap:0,
      icon: "fa-solid fa-user-group",
      increase: false,
    },
    {
      title: "Tổng số bài viết mới",
      value: 0,
      percent: 0,
      gap:0,
      icon: "fa-solid fa-image",
      increase: false,
    },
    {
      title: "Tổng số lượt yêu thích",
      value: 0,
      percent: 0,
      gap:0,
      icon: "fa-solid fa-heart",
      increase: false,
    },
    {
      title: "Tổng số báo cáo vi phạm",
      value: 0,
      percent: 0,
      gap:0,
      icon: "fa-solid fa-user-shield",
      increase: false,
    },
  ],
  loadCardsData: false,
  users: [],
  loadUsers: false,
  statistic: {
    userStatistic: [],
    postsStatistic: [],
  },
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case HOME_TYPES.GET_CARDS_DATA:
      return {
        ...state,
        cardsData: state.cardsData.map((card, index) => ({
          ...card,
          value: action.payload[index].value,
          percent: action.payload[index].percent,
          increase: action.payload[index].increase,
          gap: action.payload[index].gap,
          
        })),
        loadCardsData: true,
      };
    case HOME_TYPES.GET_TOP_5_USERS:
      return {
        ...state,
        users: action.payload,
        loadUsers: true,
      };

    case HOME_TYPES.GET_CHART_STATISTICS:
      return {
        ...state,
        statistic: {
          userStatistic: action.payload.users,
          postsStatistic: action.payload.posts,
        },
      };
    default:
      return state;
  }
};

export default authReducer;
