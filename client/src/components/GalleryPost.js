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
    dispatch({
      type: GLOBAL_TYPES.POST_DETAIL,
      payload: {
        postId: post._id,
        explore: true,
      },
    });
  };

  const calculateTotalComments = (post) => {
    return post.comments.reduce((acc, comment) => {
      return 1 + acc + (comment.replies ? comment.replies.length : 0);
    }, 0);
  };

  const detectVideoOrImage = (post) => {
    const firstImg = post.images[0];

    if (firstImg.type === "video") {
      return (
        <video width="100%" muted>
          <source src={post.images[0].url} type="video/mp4" />
          Xin lỗi, trình duyệt của bạn không hỗ trợ video này.
        </video>
      );
    }
    return <img src={firstImg.url} alt={firstImg.url} />;
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
                  {detectVideoOrImage(cluster[4])}
                  {cluster[4].images[0]?.type === "video" ? (
                    <i className="fa-solid fa-clapperboard" />
                  ) : (
                    cluster[4].images?.length > 1 && (
                      <i className="fa-solid fa-images" />
                    )
                  )}
                  <div className="gallery_overlay">
                    <span className="me-4">
                      <i className="fas fa-heart" /> {cluster[4].likes.length}
                    </span>
                    <span>
                      <i className="fas fa-comment" />{" "}
                      {calculateTotalComments(cluster[4])}
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
                    {detectVideoOrImage(post)}
                    {post.images[0]?.type === "video" ? (
                      <i className="fa-solid fa-clapperboard" />
                    ) : (
                      post.images?.length > 1 && (
                        <i className="fa-solid fa-images" />
                      )
                    )}
                    <div className="gallery_overlay">
                      <span className="me-4">
                        <i className="fas fa-heart" /> {post.likes.length}
                      </span>
                      <span>
                        <i className="fas fa-comment" />{" "}
                        {calculateTotalComments(post)}
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
                  {detectVideoOrImage(cluster[4])}
                  {cluster[4].images[0]?.type === "video" ? (
                    <i className="fa-solid fa-clapperboard" />
                  ) : (
                    cluster[4].images?.length > 1 && (
                      <i className="fa-solid fa-images" />
                    )
                  )}
                  <div className="gallery_overlay">
                    <span className="me-4">
                      <i className="fas fa-heart" /> {cluster[4].likes.length}
                    </span>
                    <span>
                      <i className="fas fa-comment" />{" "}
                      {calculateTotalComments(cluster[4])}
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
