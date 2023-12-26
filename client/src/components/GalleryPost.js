import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";

const GalleryPost = ({ posts }) => {
  const dispatch = useDispatch();

  const clusterPosts = useMemo(() => {
    const res = [];
    const group = 5;

    for (let i = 0; i < posts.length; i += group) {
      res.push(posts.slice(i, i + group));
    }

    return res;
  }, [posts]);

  const handleShowPost = (post) => {
    dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: {
      postId:post._id,
      explore:true
    } });
  };

  return (
    <div className="gallery_post">
      {clusterPosts &&
        clusterPosts.map((cluster, index) => {
          return (
            <div key={index} className="gallery_group">
              {index % 2 === 1 && cluster[4] && (
                <div
                  className="gallery_item-large"
                  onClick={() => handleShowPost(cluster[4])}
                >
                  <img src={cluster[4].images[0].url} alt="Post" />
                  {cluster[4].images.length > 1 && (
                    <i className="fa-solid fa-images" />
                  )}
                  <div className="gallery_overlay">
                    <span className="me-4">
                      <i className="fas fa-heart" /> {cluster[4].likes.length}
                    </span>
                    <span>
                      <i className="fas fa-comment" />{" "}
                      {cluster[4].comments.length}
                    </span>
                  </div>
                </div>
              )}
              <div className="gallery_group_4">
                {cluster.slice(0, 4).map((post, index) => (
                  <div
                    key={index}
                    className="gallery_item"
                    onClick={() => handleShowPost(post)}
                  >
                    <img src={post.images[0].url} alt="Post" />
                    {post.images.length > 1 && (
                      <i className="fa-solid fa-images" />
                    )}
                    <div className="gallery_overlay">
                      <span className="me-4">
                        <i className="fas fa-heart" /> {post.likes.length}
                      </span>
                      <span>
                        <i className="fas fa-comment" /> {post.comments.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {index % 2 === 0 && cluster[4] && (
                <div
                  className="gallery_item-large"
                  onClick={() => handleShowPost(cluster[4])}
                >
                  <img src={cluster[4].images[0].url} alt="Post" />
                  {cluster[4].images.length > 1 && (
                    <i className="fa-solid fa-images" />
                  )}
                  <div className="gallery_overlay">
                    <span className="me-4">
                      <i className="fas fa-heart" /> {cluster[4].likes.length}
                    </span>
                    <span>
                      <i className="fas fa-comment" />{" "}
                      {cluster[4].comments.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default GalleryPost;
