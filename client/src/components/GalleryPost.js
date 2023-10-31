import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";

const GalleryPost = ({ posts }) => {
  const { postModal } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleShowPost = (post) => {
    dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: post });
  };

  return (
    <div className="gallery_col">
      {posts &&
        posts.map((post) => (
          <div
            key={post._id}
            className="gallery_post"
            onClick={() => handleShowPost(post)}
          >
            <img src={post.images[0].url} alt="Post" />
            <div className="gallery_overlay">
              <span className="me-4">
                <i className="fas fa-heart"/> {post.likes.length}
              </span>
              <span>
                <i className="fas fa-comment"/> {post.comments.length}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default GalleryPost;
