import React, { useState } from "react";
import {useSelector,useDispatch} from 'react-redux'
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";

const CardFooter = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const {postDetail}=useSelector(state=>state)
  const dispatch=useDispatch();

  const handleShowPostDetail = ()=>{
    if (!postDetail){
      dispatch({type:GLOBAL_TYPES.POST_DETAIL,payload:post})
    }
  }

  return (
    <div className="mt-3 card_footer">
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
        <span className="fa-regular fa-comment" onClick={handleShowPostDetail}/>
        <span class="fa-regular fa-paper-plane" />
      </div>
      <p className="mb-1 mt-2" style={{ fontWeight: "600" }}>
        {post.likes.length} lượt thích
      </p>
      <div className="card_footer-content">
        <span style={{ fontWeight: "600" }}>{post.user.username} </span>
        {
          post.content.length < 80 || readMore
          ? post.content
          : post.content.slice(0, 80) + "..."
        }

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
        Xem tất cả {post.comments.length} bình luận
      </p>
    </div>
  );
};

export default CardFooter;
