import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import CardComment from "./CardComment";

const CardFooterDetail = ({ post, handleClose }) => {
  const [postModal, setPostModal] = useState(false);
  const [comment, setComment] = useState("");
  const [isLike, setIsLike] = useState(false);
  const { auth, postDetail, sharePost } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fake API
    setPostModal(post);
  }, [post]);

  const handleShowPostDetail = () => {
    if (!postDetail) {
      dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: post });
    }
  };
  const handleShowSharePost = () => {
    if (!sharePost) {
      dispatch({ type: GLOBAL_TYPES.SHARE_POST, payload: post });
    }
  };

  const handleLike = () => {
    setIsLike(true);
    setPostModal({
      ...postModal,
      likes: [...postModal.likes, auth._id],
    });
  };
  const handleUnLike = () => {
    setIsLike(false);
    setPostModal({
      ...postModal,
      likes: postModal.likes.filter((like) => like !== auth._id),
    });
  };

  const handleComment = (e) => {
    e.preventDefault();
    const newComment = {
      content: comment,
      user: auth,
      createdAt: new Date().toISOString(),
    };
    setPostModal({
      ...postModal,
      comments: [newComment, ...postModal.comments],
    });
    setComment("");
  };

  const handleDeleteComment = () => {
    setPostModal({
      ...postModal,
      comments: postModal.comments.filter(
        (comment) => comment.user._id !== auth._id
      ),
    });
  };

  return (
    <div className="mt-3 pt-3 pb-1 px-2  flex-fill d-flex flex-column card_footer">
      {postModal && (
        <>
          <div className="card_footer-comments mb-3">
            <CardComment
              content={postModal.content}
              user={postModal.user}
              handleClose={handleClose}
            />

            {postModal.comments.map((comment, index) => (
              <CardComment
                key={index}
                user={comment.user}
                content={comment.content}
                createdAt={comment.createdAt}
                handleClose={handleClose}
                handleDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
          <div className="card_footer-icons">
            {isLike ? (
              <span
                class="fa-solid fa-heart"
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
              class="fa-regular fa-paper-plane"
              onClick={handleShowSharePost}
            />
          </div>
          <p className="my-2" style={{ fontWeight: "600", fontSize: "14px" }}>
            {postModal.likes.length} lượt thích
          </p>
          <form onSubmit={handleComment} className="form-comment">
            <input
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Thêm bình luận..."
            />
            <button
              className="btn btn-comment"
              type="submit"
              disabled={comment.length < 1 ? true : false}
              style={{ color: "var(--primary-color)" }}
            >
              Đăng
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CardFooterDetail;
