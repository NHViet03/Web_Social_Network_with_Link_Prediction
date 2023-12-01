import { POST_TYPES } from "../actions/postAction";

const initialState = {
  posts: [],
  result: 0,
  users: [
    {
      _id: "abc123",
      username: "xeesoxee",
      fullname: "Han So-hee",
      avatar:
        "https://i.pinimg.com/564x/14/9a/e0/149ae0f72060755d652d4d09591c6691.jpg",
    },
    {
      _id: "abc670",
      username: "rohyoonseo",
      fullname: "Roh Yoon-seo",
      avatar:
        "https://i.pinimg.com/564x/20/92/2c/20922c29d6d7ec392068f4a924a5ebd6.jpg",
    },
    {
      _id: "abc679",
      username: "rosalineyuhh",
      fullname: "Rosa Line",
      avatar:
        "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/395465307_532495459099163_6143034257415964199_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFcfoE6yIwvbxu7SkRe6Aqqz3ycLNOzlu3PfJws07OW7c75IV2cO9E9iLWj80zbzQvX_OyX4p-sn_N8lcbP4dh8&_nc_ohc=yzbKK_12uF0AX_xse8f&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdSpk-zY4au6stUa5CEp4IduEINQfVcvoBkVwXkNfnFKjg&oe=65687E9F",
    },
    {
      _id: "abc680",
      username: "phs1116",
      fullname: "PARK HYUNGSIK",
      avatar:
        "https://i.pinimg.com/564x/1e/b0/22/1eb022bc5bc2be053ba0f363de7b75ad.jpg",
    },
    {
      _id: "abc681",
      username: "bogummy",
      fullname: "PARK BO GUM",
      avatar:
        "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/395301626_1274645599916557_3505396367880739948_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHaABJJFY00DTrgJdaCxc2DP0oNOZIQh5s_Sg05khCHm7jSOnRvalGV7mpD3aYZb3zgDcvqz_ixLA4vqnlbUJKz&_nc_ohc=wnRmsQe7KhMAX9Rcv--&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdSKz3dtXJolfc4Dh8GdZxAFCW_e2BCVZIOl-O8gCgxHVA&oe=6568A648",
    },
    {
      _id: "abc105",
      username: "lavieenbluu",
      fullname: "Park Gyu-young",
      avatar:
        "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/368591203_718249323495961_8215655904493420963_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeF7av1jU9wtBPLnVg54AnFbh0UfhyrkjfuHRR-HKuSN-3EU3Zvcf_qyiDI0U6gGZF16FRYXkMPe2xjhsFsagWyx&_nc_ohc=NymJjJJjDYoAX9NNuQE&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdR5YkeqJLOJCC4n4yUSA-ALVt9_3vELb6cGYO0Pn4O7MA&oe=65688115",
    },
    {
      _id: "abc108",
      username: "thv",
      fullname: "V",
      avatar:
        "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/396312643_709463721056013_4572404616959222186_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGLZ6HANuhQdEz8n1sDN-9ohUcHDfNEpOSFRwcN80Sk5NuBZKcEYdth6upfKiXSMirE2q3sfAqQjNPiWYYelvPi&_nc_ohc=3n4Fm1lEUdAAX8XTlwE&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdQSWM-iVEMCRoo1o5LpH2g9AskZ7Cv4_rkd9MDPXqIm6A&oe=6568AEC7",
    },
    {
      _id: "abc107",
      username: "hihyunwoo",
      fullname: "이현우",
      avatar:
        "https://scontent.fsgn5-5.fna.fbcdn.net/v/t1.15752-9/371461896_1709932952822028_4130076371343332306_n.png?_nc_cat=100&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFPQOdI5j1QutUf6Fzasj95INzZLAVViM0g3NksBVWIzU7SqJu85zlgFs_z-QdKJfsy36-lCSmEyy7Ut-N0_LdR&_nc_ohc=NY1irItYTK8AX_R4Oim&_nc_ht=scontent.fsgn5-5.fna&oh=03_AdQvCTFmNkvcdBX8-hTc8zPITiZloeNkw_YVD7VJqzsysQ&oe=6568AD6C",
    },
    {
      _id: "abc111",
      username: "yejinhand",
      fullname: "Son Ye-Jin",
      avatar:
        "https://scontent.fsgn5-12.fna.fbcdn.net/v/t1.15752-9/396697211_205262485926980_571658785852988638_n.png?_nc_cat=103&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFSXVawaqJiUqdMTtaWf9C4WqrNaMkxIVRaqs1oyTEhVEEg2xaTPI20Yu-fVm_AVM571uS7q2Ft8sMS_nriJTP4&_nc_ohc=HJUWvVcFjNIAX_IGNkn&_nc_ht=scontent.fsgn5-12.fna&oh=03_AdQj0ZsRzFi1P1lx2VDbgq_yObpHijXetP2azEoh9QRyrA&oe=65689A53",
    },
    {
      _id: "abc456",
      username: "shinseulkee",
      fullname: "Shin Seul-Ki",
      avatar:
        "https://i.pinimg.com/564x/22/60/3a/22603ab665885115366fdc481c652628.jpg",
    },
  ],
  firstLoad:false
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_TYPES.CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case POST_TYPES.GET_POSTS:
      return {
        ...state,
        posts: action.payload.posts,
        result: action.payload.result,
        firstLoad:true
      };
    case POST_TYPES.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case POST_TYPES.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export default postReducer;
