import { GLOBAL_TYPES, DeleteData } from "./globalTypes";
import { getDataAPI, patchDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";
import { createNotify, removeNotify } from "./notifyAction";

export const PROFILE_TYPES = {
  LOADING: "LOADING_PROFILE",
  GET_USER: "GET_PROFILE_USER",
  FOLLOW: "FOLLOW",
  UNFOLLOW: "UNFOLLOW",
  GET_ID: "GET_PROFILE_ID",
  GET_POSTS: "GET_PROFILE_POSTS",
  DELETE_POST_PROFILE: "DELETE_POST_PROFILE",
};

export const getProfileUsers =
  ({  id, token }) =>
  async (dispatch) => {
    dispatch({
      type: PROFILE_TYPES.GET_ID,
      payload: { id },
    });
    try {
      dispatch({ type: PROFILE_TYPES.LOADING, payload: true });
      const res = getDataAPI(`/user/${id}`, token);
      const res1 = getDataAPI(`/user_posts/${id}`, token);

      const users = await res;
      const posts = await res1;

      dispatch({ type: PROFILE_TYPES.GET_USER, payload: users.data });
      dispatch({
        type: PROFILE_TYPES.GET_POSTS,
        payload: { ...posts.data, _id: id, page: 2 },
      });

      dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const updateProfileUsers =({ userData, avatar, auth }) => async (dispatch) => {  
    if (!userData.fullname)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: "Vui lòng nhập tên." },
      });

    if (userData.fullname.length > 25)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: "Tên không được vượt quá 25 ký tự." },
      });

    if (!userData.username)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: "Vui lòng nhập tên người dùng." },
      });

    if (userData.username.length > 25)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: "Tên người dùng không được vượt quá 25 ký tự." },
      });

    if (userData.story.length > 200)
      return dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: "Tiểu sử không được vượt quá 200 ký tự." },
      });

    try {
      let media;
      dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
      if (avatar) media = await imageUpload([avatar]);

      const res = await patchDataAPI("user",
        {
          ...userData,
          avatar: avatar ? media[0].url : auth.user.avatar,
        },
        auth.token
      );

      dispatch({
        type: GLOBAL_TYPES.AUTH,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            ...userData,
            avatar: avatar ? media[0].url : auth.user.avatar,
          },
        },
      });
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { success: res.data.msg },
      });
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

export const follow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    let newUser;

    if (users.every((item) => item._id !== user._id)) {
      newUser = { ...user, followers: [...user.followers, auth.user] };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = { ...item, followers: [...item.followers, auth.user] };
        }
      });
    }

    // Notify
    const msg = {
      id: auth.user._id,
      content: " đã bắt đầu theo dõi bạn.",
      recipients: [user._id],
      url: `/profile/${auth.user._id}`,
      user: auth.user,
    };

    dispatch(createNotify({ msg, auth, socket }));

    dispatch({
      type: PROFILE_TYPES.FOLLOW,
      payload: newUser,
    });
    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          following: [...auth.user.following, newUser],
        },
      },
    });

    try {
      await patchDataAPI(`/user/${user._id}/follow`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };
export const unfollow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    let newUser;

    if (users.every((item) => item._id !== user._id)) {
      newUser = {
        ...user,
        followers: DeleteData(user.followers || [], auth.user._id),
      };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = {
            ...item,
            followers: DeleteData(item.followers, auth.user._id),
          };
        }
      });
    }

    dispatch({
      type: PROFILE_TYPES.UNFOLLOW,
      payload: newUser,
    });
    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          following: DeleteData(auth.user.following, newUser._id),
        },
      },
    });

    // Notify
    const msg = {
      id: auth.user._id,
      recipients: [user],
      url: `/profile/${auth.user._id}`,
      user: auth.user,
    };

    dispatch(removeNotify({ msg, auth, socket }));

    try {
      await patchDataAPI(`/user/${user._id}/unfollow`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };
