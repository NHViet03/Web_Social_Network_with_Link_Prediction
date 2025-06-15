import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";

const PostThumb = ({ posts, result }) => {
  const { theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <div className="post_thumb">
      {posts.map((post) => (
        <div
          className="post_thumb-display"
          key={post._id}
          onClick={() =>
            dispatch({ type: GLOBAL_TYPES.POST_DETAIL, payload: post._id })
          }
        >
          {post.images[0]?.type === "video" ? (
            <video width="100%" muted>
              <source src={post.images[0].url} type="video/mp4" />
              Xin lỗi, trình duyệt của bạn không hỗ trợ video này.
            </video>
          ) : (
            <img
              src={post.images[0].url}
              alt={post.images[0].url}
              style={{ filter: theme ? "invert(1)" : "invert(0)" }}
            />
          )}

          <div className="post_thumb_menu">
            <div className="post_thumb_menu_react">
              <i
                className="fa-solid fa-heart mx-1"
                style={{ color: "white" }}
              />
              <div style={{ color: "white" }}>{post.likes.length}</div>
            </div>
            <div className="post_thumb_menu_react">
              <i
                className="fa-solid fa-comment mx-1"
                style={{ color: "white" }}
              />
              <div style={{ color: "white" }}>{post.comments.length}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostThumb;
