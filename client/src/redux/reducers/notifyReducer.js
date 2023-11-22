const initialState = {
    notifies: [
      {
        content: " đã bình luận về bài viết của bạn.",
        user: {
          _id: "abc123",
          username: "xeesoxee",
          fullname: "Han So-hee",
          avatar:
          "https://i.pinimg.com/564x/14/9a/e0/149ae0f72060755d652d4d09591c6691.jpg",
        },
        createdAt: "2023-11-9",
      },
      {
        content: " đã bắt đầu theo dõi bạn.",
        user: {
          _id: "abc670",
          username: "rohyoonseo",
          fullname: "Roh Yoon-seo",
          avatar:
          "https://i.pinimg.com/564x/20/92/2c/20922c29d6d7ec392068f4a924a5ebd6.jpg",
        },
        createdAt: "2023-11-9",
      },
      {
        content: " đã bắt đầu theo dõi bạn.",
        user: {
          _id: "abc679",
          username: "rosalineyuhh",
          fullname: "Rosa Line",
          avatar:
            "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.15752-9/395465307_532495459099163_6143034257415964199_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFcfoE6yIwvbxu7SkRe6Aqqz3ycLNOzlu3PfJws07OW7c75IV2cO9E9iLWj80zbzQvX_OyX4p-sn_N8lcbP4dh8&_nc_ohc=yzbKK_12uF0AX_xse8f&_nc_ht=scontent.fsgn5-6.fna&oh=03_AdSpk-zY4au6stUa5CEp4IduEINQfVcvoBkVwXkNfnFKjg&oe=65687E9F",
        },
        createdAt: "2023-11-8",
      },
  
      {
        content: " đã bắt đầu theo dõi bạn.",
        user: {
          _id: "abc680",
          username: "phs1116",
          fullname: "PARK HYUNGSIK",
          avatar:
          "https://i.pinimg.com/564x/1e/b0/22/1eb022bc5bc2be053ba0f363de7b75ad.jpg",
        },
        createdAt: "2023-11-8",
      },
      {
        content: " đã thích bài viết của bạn.",
        user: {
          _id: "abc105",
          username: "lavieenbluu",
          fullname: "Park Gyu-young",
          avatar:
            "https://scontent.fsgn5-10.fna.fbcdn.net/v/t1.15752-9/368591203_718249323495961_8215655904493420963_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeF7av1jU9wtBPLnVg54AnFbh0UfhyrkjfuHRR-HKuSN-3EU3Zvcf_qyiDI0U6gGZF16FRYXkMPe2xjhsFsagWyx&_nc_ohc=NymJjJJjDYoAX9NNuQE&_nc_ht=scontent.fsgn5-10.fna&oh=03_AdR5YkeqJLOJCC4n4yUSA-ALVt9_3vELb6cGYO0Pn4O7MA&oe=65688115",
        },
        createdAt: "2023-11-1",
      },
    ],
  };
  
  const notifyReducer = (state = initialState, action) => {
    switch (action.type) {
      default:
        return state;
    }
  };
  
  export default notifyReducer;
  