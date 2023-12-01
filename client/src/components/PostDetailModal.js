import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";
import CardHeader from "./postCard/CardHeader";
import CardBody from "./postCard/CardBody";
import CardFooterDetail from "./postCard/CardFooterDetail";

const PostDetailModal = () => {
  const { homePosts, explore, postDetail } = useSelector((state) => ({
    postDetail: state.postDetail,
    homePosts: state.homePosts,
    explore: state.explore,
  }));
  const [post, setPost] = useState(false);

  useEffect(() => {
    if (postDetail) {
      let post = {};
      if (postDetail.explore) {
        post = explore.posts.find((item) => item._id === postDetail.postId);
      } else {
        post = homePosts.posts.find((item) => item._id === postDetail);
      }

      setPost(post);
    }
  }, [explore.posts, homePosts.posts, postDetail]);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: false });
  };

  return (
    <div className="postDetail_modal">
      {post && (
        <div className="d-flex postDetail_modal-content">
          <div className="col-7">
            <CardBody post={post} />
          </div>
          <div className="col-5 mt-2 d-flex flex-column">
            <div className="px-2">
              <CardHeader user={post.user} post={post} />
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
      )}
    </div>
  );
};

export default PostDetailModal;
