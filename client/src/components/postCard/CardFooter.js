import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import LikeButton from "../LikeButton";
import BookMarkButton from "./BookMarkButton";

const CardFooter = ({ post }) => {
  const [postModal, setPostModal] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fake API
    setPostModal(post);
  }, [post]);

  const handleLike = () => {
    setIsLike(true);
    setPostModal({
      ...postModal,
      likes: [...postModal.likes, auth.user._id],
    });
  };
  const handleUnLike = () => {
    setIsLike(false);
    setPostModal({
      ...postModal,
      likes: postModal.likes.filter((like) => like !== auth.user._id),
    });
  };

  const handleBookmark = () => {
    setIsBookmark(true);
  };

  const handleUnBookmark = () => {
    setIsBookmark(false);
  };

  const handleShowPostDetail = () => {
      dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: postModal });
  };
  const handleShowSharePost = () => {
   
      dispatch({ type: GLOBAL_TYPES.SHARE_POST, payload: postModal });
    
  };

  return (
    <div className="mt-3 card_footer">
      {postModal && (
        <>
          <div className="card_footer-icons">
            <div>
              <LikeButton
                isLike={isLike}
                handleLike={handleLike}
                handleUnLike={handleUnLike}
              />
              <span
                className="fa-regular fa-comment"
                onClick={handleShowPostDetail}
              />
              <span
                className="fa-regular fa-paper-plane"
                onClick={handleShowSharePost}
              />
            </div>
            <BookMarkButton
              isBookmark={isBookmark}
              handleBookmark={handleBookmark}
              handleUnBookmark={handleUnBookmark}
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
            {postModal.comments.length > 0
              ? `Xem tất cả ${postModal.comments.length} bình luận`
              : "Thêm bình luận..."}
          </p>
        </>
      )}
    </div>
  );
};

export default CardFooter;
