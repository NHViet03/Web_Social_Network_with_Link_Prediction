import { GLOBAL_TYPES } from "./globalTypes";
import { imageUpload } from "../../utils/imageUpload";
import {
  postDataAPI,
  getDataAPI,
  patchDataAPI,
  deleteDataAPI,
} from "../../utils/fetchData";

export const POST_TYPES = {
  CREATE_POST: "CREATE_POST",
  GET_POSTS: "GET_POSTS",
  UPDATE_POST: "UPDATE_POST",
  DELETE_POST: "DELETE_POST",
};

export const createPost =
  ({ post, auth }) =>
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
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const getPosts = (auth) => async (dispatch) => {
  try {
    const res = await getDataAPI("posts", auth.token);

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
  ({ post, auth }) =>
  async (dispatch) => {
    dispatch({
      type: POST_TYPES.DELETE_POST,
      payload: post,
    });

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
