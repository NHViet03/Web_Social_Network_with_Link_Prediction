import { GLOBAL_TYPES } from "./globalTypes";
import { imageUpload } from "../../utils/imageUpload";
import {
  postDataAPI,
  getDataAPI,
  patchDataAPI,
  deleteDataAPI,
} from "../../utils/fetchData";
import { EXPLORE_TYPES } from "./exploreAction";
import { createNotify, removeNotify } from "./notifyAction";

export const POST_TYPES = {
  CREATE_POST: "CREATE_POST",
  GET_POSTS: "GET_POSTS",
  UPDATE_POST: "UPDATE_POST",
  DELETE_POST: "DELETE_POST",
};

export const createPost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    try {
      let media = [];
      if (post.images.length > 0) media = await imageUpload(post.images);

      const res = await postDataAPI(
        "create_post",
        {
          content: post.content,
          images: media,
        },
        auth.token
      );

      dispatch({
        type: POST_TYPES.CREATE_POST,
        payload: {
          ...res.data.post,
          user: auth.user,
        },
      });

      // Notify
      const msg = {
        id: res.data.post._id,
        content: " đã thêm một bài viết.",
        recipients: auth.user.followers,
        url: `/post/${res.data.post._id}`,
        image: res.data.post.images[0].url,
        user: auth.user,
      };

      dispatch(createNotify({ msg, auth, socket }));
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const getPosts =
  ({ auth, page = 1 }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(`posts?limit=${page * 5}`, auth.token);

      dispatch({
        type: POST_TYPES.GET_POSTS,
        payload: {
          ...res.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const updatePost =
  ({ post, auth }) =>
  async (dispatch) => {
    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: post,
    });

    try {
      await patchDataAPI(
        `post/${post._id}`,
        {
          content: post.content,
        },
        auth.token
      );
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const deletePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    dispatch({
      type: POST_TYPES.DELETE_POST,
      payload: post,
    });

    // Notify
    const msg = {
      id: post._id,
      url: `/post/${post._id}`,
      recipients: auth.user.followers,
      user: auth.user,
    };

    dispatch(removeNotify({ msg, auth, socket }));

    try {
      await deleteDataAPI(`post/${post._id}`, auth.token);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const likePost =
  ({ post, auth, explore, socket }) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      likes: [...post.likes, auth.user._id],
    };

    if (explore) {
      dispatch({
        type: EXPLORE_TYPES.UPDATE_POST,
        payload: newPost,
      });
    } else {
      dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: newPost,
      });
    }

    // Notify
    const msg = {
      id: auth.user._id,
      content: " đã thích bài viết của bạn.",
      recipients: [post.user._id],
      url: `/post/${post._id}`,
      image: post.images[0].url,
      user: auth.user,
    };

    dispatch(createNotify({ msg, auth, socket }));
    try {
      await patchDataAPI(`like_post/${post._id}`, null, auth.token);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const unLikePost =
  ({ post, auth, explore, socket }) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      likes: post.likes.filter((like) => like !== auth.user._id),
    };

    if (explore) {
      dispatch({
        type: EXPLORE_TYPES.UPDATE_POST,
        payload: newPost,
      });
    } else {
      dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: newPost,
      });
    }

    // Notify
    const msg = {
      id: auth.user._id,
      recipients: [post.user],
      url: `/post/${post._id}`,
      user: auth.user,
    };

    dispatch(removeNotify({ msg, auth, socket }));

    try {
      await patchDataAPI(`unlike_post/${post._id}`, null, auth.token);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const savePost =
  ({ post, auth }) =>
  async (dispatch) => {
    const newUser = {
      ...auth.user,
      saved: [...auth.user.saved, post],
    };

    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        ...auth,
        user: newUser,
      },
    });

    try {
      await patchDataAPI(`save_post/${post._id}`, null, auth.token);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const unSavePost =
  ({ post, auth }) =>
  async (dispatch) => {
    const newUser = {
      ...auth.user,
      saved: auth.user.saved.filter((save) => save._id !== post._id),
    };

    dispatch({
      type: GLOBAL_TYPES.AUTH,
      payload: {
        ...auth,
        user: newUser,
      },
    });

    try {
      await patchDataAPI(`unsave_post/${post._id}`, null, auth.token);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const reportPost =
  ({ post, reason, auth }) =>
  async (dispatch) => {
    const newReport = {
      id: post._id,
      reason,
      reporter: auth.user._id,
    };

    try {
      await postDataAPI("report_post", newReport, auth.token);
      dispatch({
        type: POST_TYPES.DELETE_POST,
        payload: post,
      });
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };
