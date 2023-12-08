import React, { useState, useEffect } from "react";
import LikeButton from "../LikeButton";
import BookMarkButton from "./BookMarkButton";

import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { likePost, unLikePost } from "../../redux/actions/postAction";

const CardFooter = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (post.likes.find((like) => like === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [auth.user._id, post]);

  const handleLike = async () => {
    if (loadLike) return;
    setLoadLike(true);
    setIsLike(true);
    await dispatch(likePost({ post, auth }));
    setLoadLike(false);
  };
  const handleUnLike = async () => {
    if (loadLike) return;
    setLoadLike(true);
    setIsLike(false);
    await dispatch(unLikePost({ post, auth }));
    setLoadLike(false);
  };

  const handleBookmark = () => {
    setIsBookmark(true);
  };

  const handleUnBookmark = () => {
    setIsBookmark(false);
  };

  const handleShowPostDetail = () => {
    dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: post._id }); 
  };
  const handleShowSharePost = () => {
    dispatch({ type: GLOBAL_TYPES.SHARE_POST, payload: post });
  };

  return (
    <div className="mt-3 card_footer">
      {post && (
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
            {post.likes.length} lượt thích
          </p>
          <div className="card_footer-content">
            <span style={{ fontWeight: "600" }}>{post.user.username} </span>
            {post.content.length < 80 || readMore
              ? post.content
              : post.content.slice(0, 80) + "..."}

            {post.content.length > 80 && (
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
            {post.comments.length > 0
              ? `Xem tất cả ${post.comments.length} bình luận`
              : "Thêm bình luận..."}
          </p>
        </>
      )}
    </div>
  );
};

export default CardFooter;
