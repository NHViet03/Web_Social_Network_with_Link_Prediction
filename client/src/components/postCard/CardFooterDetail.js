import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import CardComment from "./CardComment";

const CardFooterDetail = ({ post, handleClose }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [isLike, setIsLike] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const { auth, postDetail } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleShowPostDetail = () => {
    if (!postDetail) {
      dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: post });
    }
  };
  const handleComment = (e) => {
    e.preventDefault();
    const newComment = {
      content: comment, 
      user: auth,
    };
    setComments([...comments, newComment]);
    setComment("");
  };

  return (
    <div className="mt-3 pt-3 pb-1 px-2  flex-fill d-flex flex-column card_footer">
      <div className="card_footer-comments mb-3">
        <CardComment
          user={post.user}
          comment={post.content}
          handleClose={handleClose}
        />
        {comments &&
          comments.map((comment, index) => (
            <CardComment
              key={index}
              user={comment.user}
              comment={comment.content}
              handleClose={handleClose}
            />
          ))}
      </div>
      <div className="card_footer-icons">
        {isLike ? (
          <span
            class="fa-solid fa-heart"
            style={{ color: "var(--primary-color)" }}
            onClick={() => setIsLike(false)}
          />
        ) : (
          <span
            className="fa-regular fa-heart"
            onClick={() => setIsLike(true)}
          />
        )}
        <span
          className="fa-regular fa-comment"
          onClick={handleShowPostDetail}
        />
        <span class="fa-regular fa-paper-plane" />
      </div>
      <p className="my-2" style={{ fontWeight: "600", fontSize: "14px" }}>
        {post.likes.length} lượt thích
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
    </div>
  );
};

export default CardFooterDetail;
