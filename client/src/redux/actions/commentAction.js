import { GLOBAL_TYPES } from "./globalTypes";
import { POST_TYPES } from "./postAction";
import { EXPLORE_TYPES } from "./exploreAction";
import {
  postDataAPI,
  patchDataAPI,
  deleteDataAPI,
} from "../../utils/fetchData";
import { createNotify, removeNotify } from "./notifyAction";

export const createComment =
  ({ post, newComment, auth, explore, socket }) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      comments: [...post.comments, newComment],
    };

    dispatch({
      type: EXPLORE_TYPES.UPDATE_POST,
      payload: newPost,
    });

    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: newPost,
    });

    try {
      const res = await postDataAPI("create_comment", newComment, auth.token);

      dispatch({
        type: EXPLORE_TYPES.UPDATE_POST,
        payload: res.data.newPost,
      });

      dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: res.data.newPost,
      });

      // Notify
      const msg = {
        id: res.data.comment._id,
        content: ` đã bình luận về bài viết của bạn: "${
          newComment.content.length > 10
            ? newComment.content.slice(0, 10) + "..."
            : newComment.content
        }".`,
        recipients: [post.user._id],
        url: `/post/${post._id}`,
        image: post.images[0].url,
        user: auth.user,
      };

      dispatch(createNotify({ msg, auth, socket }));
      return res.data.newPost;
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
  ({ post, comment, auth, explore, socket }) =>
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
      type: EXPLORE_TYPES.UPDATE_POST,
      payload: newPost,
    });

    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: newPost,
    });

    // Notify
    const msg = {
      id: comment._id,
      content: ` đã thích bình luận của bạn: "${
        comment.content.length > 10
          ? comment.content.slice(0, 10) + "..."
          : comment.content
      }".`,
      recipients: [comment.user._id],
      url: `/post/${post._id}`,
      image: post.images[0].url,
      user: auth.user,
    };

    dispatch(createNotify({ msg, auth, socket }));

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
  ({ post, comment, auth, explore, socket }) =>
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
      type: EXPLORE_TYPES.UPDATE_POST,
      payload: newPost,
    });

    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: newPost,
    });

    // Notify
    const msg = {
      id: comment._id,
      recipients: [comment.user],
      url: `/post/${post._id}`,
      user: auth.user,
    };

    dispatch(removeNotify({ msg, auth, socket }));

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
  ({ post, comment, auth, explore, socket }) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      comments: post.comments.filter((cm) => cm._id !== comment._id),
    };

    dispatch({
      type: EXPLORE_TYPES.UPDATE_POST,
      payload: newPost,
    });

    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: newPost,
    });

    // Notify
    const msg = {
      id: comment._id,
      recipients: [post.user],
      url: `/post/${post._id}`,
      user: auth.user,
    };

    dispatch(removeNotify({ msg, auth, socket }));

    try {
      await deleteDataAPI(
        `comment/${comment._id}/${comment.postId}`,
        auth.token
      );
      return newPost;
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: error.response.data.msg,
        },
      });
    }
  };
