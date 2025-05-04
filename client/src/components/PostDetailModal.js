import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";
import CardHeader from "./postCard/CardHeader";
import CardBody from "./postCard/CardBody";
import CardFooterDetail from "./postCard/CardFooterDetail";

import { getDataAPI } from "../utils/fetchData";
import Loading from "./Loading";

const PostDetailModal = () => {
  const { auth, homePosts, explore, postDetail } = useSelector((state) => ({
    auth: state.auth,
    postDetail: state.postDetail,
    homePosts: state.homePosts,
    explore: state.explore,
  }));
  const dispatch = useDispatch();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postDetail) {
      let findPost = {};

      findPost = explore.posts.find(
        (item) => item._id === (postDetail.postId || postDetail)
      );

      if (!findPost) {
        findPost = homePosts.posts.find(
          (item) => item._id === (postDetail.postId || postDetail)
        );
      }

      // If the post is not fount in homePost or Explore Post, find it in database
      if (!findPost) {
        setLoading(true);
        getDataAPI(`post/${postDetail.postId || postDetail}`, auth.token)
          .then((res) => {
            setPost(res.data.post);
            setLoading(false);
          })
          .catch((err) => {
            dispatch({
              type: GLOBAL_TYPES.ALERT,
              payload: { error: err.response.data.msg },
            });
          });
      }

      setPost(findPost || {});
    }
  }, [explore.posts, homePosts.posts, postDetail]);

  const handleClose = () => {
    dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: false });
  };

  return (
    <div className="postDetail_modal">
      {Object.keys(post).length > 0 ? (
        <div className="d-flex postDetail_modal-content">
          <div className="col-7">
            <CardBody post={post} />
          </div>
          <div className="col-5 mt-2 d-flex flex-column">
            <div className="px-2">
              <CardHeader
                user={post.user}
                post={post}
                follow={postDetail.explore && true}
              />
            </div>
            <CardFooterDetail
              post={post}
              handleClose={handleClose}
              explore={postDetail.explore}
            />
          </div>
          <span className="material-icons modal-close" onClick={handleClose}>
            close
          </span>
        </div>
      ) : (
        <div className="d-flex postDetail_modal-content  ">
          {loading && (
            <div className="w-100 d-flex justify-content-center align-items-center">
              <Loading />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetailModal;
