import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LikeButton from "../LikeButton";
import BookMarkButton from "./BookMarkButton";

import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import {
  likePost,
  unLikePost,
  savePost,
  unSavePost,
} from "../../redux/actions/postAction";

const CardFooter = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [loadSave, setLoadSave] = useState(false);

  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (post.likes.find((like) => like === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [auth.user._id, post]);

  useEffect(() => {
    if (auth.user.saved.find((save) => save._id === post._id)) {
      setIsBookmark(true);
    } else {
      setIsBookmark(false);
    }
  }, [auth.user._id, auth.user.saved, post]);

  const handleLike = async () => {
    if (loadLike) return;
    setLoadLike(true);
    setIsLike(true);
    await dispatch(likePost({ post, auth, socket }));
    setLoadLike(false);
  };
  const handleUnLike = async () => {
    if (loadLike) return;
    setLoadLike(true);
    setIsLike(false);
    await dispatch(unLikePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleBookmark = async () => {
    if (loadSave) return;
    setLoadSave(true);
    setIsBookmark(true);
    await dispatch(savePost({ post, auth }));
    setLoadSave(false);
  };

  const handleUnBookmark = async () => {
    if (loadSave) return;
    setLoadSave(true);
    setIsBookmark(false);
    await dispatch(unSavePost({ post, auth }));
    setLoadSave(false);
  };

  const handleShowPostDetail = () => {
    dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: post._id });
  };
  const handleShowSharePost = () => {
    dispatch({ type: GLOBAL_TYPES.SHARE_POST, payload: post });
  };

  const generateHashtags = () => {
    const hashtags = post.hashtags.map((hashtag, index) => {
      return (
        <Link
          key={index}
          className="hashtag"
          to={`/explore/hashtags/${hashtag}`}
        >
          #{hashtag}
        </Link>
      );
    });
    return hashtags;
  };

  const calculateTotalComments = () => {
    return post.comments.reduce((acc, comment) => {
      return 1 + acc + (comment.replies ? comment.replies.length : 0);
    }, 0);
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
            <div>
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
            {post.hashtags?.length > 0 && (
              <div
                style={{
                  color: "rgb(65, 80, 247)",
                  display: "flex",
                  gap: "6px",
                }}
              >
                {generateHashtags()}
              </div>
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
              ? `Xem tất cả ${calculateTotalComments()} bình luận`
              : "Thêm bình luận..."}
          </p>
        </>
      )}
    </div>
  );
};

export default CardFooter;
