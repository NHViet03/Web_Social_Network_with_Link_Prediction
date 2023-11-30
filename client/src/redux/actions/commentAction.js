import { GLOBAL_TYPES } from "./globalTypes";
import { POST_TYPES } from "./postAction";
import {
  postDataAPI,
  patchDataAPI,
  deleteDataAPI,
} from "../../utils/fetchData";

export const createComment =
  ({ post, newComment, auth }) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      comments: [...post.comments, newComment],
    };
    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: newPost,
    });

    try {
      const res = await postDataAPI("create_comment", newComment, auth.token);

      dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: res.data.newPost,
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

export const likeComment =
  ({ post, comment, auth }) =>
  async (dispatch) => {
    const newComment = {
      ...comment,
      likes: [...comment.likes, auth.user._id],
    };

    const newPost = {
      ...post,
      comments: post.comments.map((cm) =>
        cm._id === comment._id ? newComment : cm
      ),
    };

    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: newPost,
    });

    try {
      await patchDataAPI(`like_comment/${comment._id}`, null, auth.token);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const unLikeComment =
  ({ post, comment, auth }) =>
  async (dispatch) => {
    const newComment = {
      ...comment,
      likes: comment.likes.filter((like) => like !== auth.user._id),
    };

    const newPost = {
      ...post,
      comments: post.comments.map((cm) =>
        cm._id === comment._id ? newComment : cm
      ),
    };

    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: newPost,
    });

    try {
      await patchDataAPI(`unlike_comment/${comment._id}`, null, auth.token);
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };

export const deleteComment =
  ({ post, comment, auth }) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      comments: post.comments.filter((cm) => cm._id !== comment._id),
    };

    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: newPost,
    });

    try {
      await deleteDataAPI(
        `comment/${comment._id}/${comment.postId}`,
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
