import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";

const CardFooter = ({ post }) => {
  const [postModal, setPostModal] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const { auth, postDetail, sharePost } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fake API
    setPostModal(post);
  }, [post]);

  const handleLike = () => {
    setIsLike(true);
    setPostModal({
      ...postModal,
      likes:[...postModal.likes,auth._id]
    })
  };
  const handleUnLike = () => {
    setIsLike(false);
    setPostModal({
      ...postModal,
      likes:postModal.likes.filter(like=>like!==auth._id)
    })
  };

  const handleShowPostDetail = () => {
    if (!postDetail) {
      dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: postModal });
    }
  };
  const handleShowSharePost = () => {
    if (!sharePost) {
      dispatch({ type: GLOBAL_TYPES.SHARE_POST, payload: postModal });
    }
  };

  return (
    <div className="mt-3 card_footer">
      {postModal && (
        <>
          <div className="card_footer-icons">
            {isLike ? (
              <span
                className="fa-solid fa-heart"
                style={{ color: "var(--primary-color)" }}
                onClick={handleUnLike}
              />
            ) : (
              <span className="fa-regular fa-heart" onClick={handleLike} />
            )}
            <span
              className="fa-regular fa-comment"
              onClick={handleShowPostDetail}
            />
            <span
              className="fa-regular fa-paper-plane"
              onClick={handleShowSharePost}
            />
          </div>
          <p className="mb-1 mt-2" style={{ fontWeight: "600" }}>
            {postModal.likes.length} lượt thích
          </p>
          <div className="card_footer-content">
            <span style={{ fontWeight: "600" }}>
              {postModal.user.username}{" "}
            </span>
            {postModal.content.length < 80 || readMore
              ? postModal.content
              : postModal.content.slice(0, 80) + "..."}

            {postModal.content.length > 80 && (
              <small
                onClick={() => setReadMore(!readMore)}
                style={{
                  display: "block",
                  cursor: "pointer",
                  color: "var(--text-color)",
                }}
              >
                {readMore ? " Ẩn bớt " : " Xem thêm "}
              </small>
            )}
          </div>
          <p
            className="mt-2 mb-0"
            style={{
              color: "var(--text-color)",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={handleShowPostDetail}
          >
            Xem tất cả {postModal.comments.length} bình luận
          </p>
        </>
      )}
    </div>
  );
};

export default CardFooter;
