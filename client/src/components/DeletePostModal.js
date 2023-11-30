import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deletePost } from "../redux/actions/postAction";

const DeletePostModal = ({ post, setShowDelete }) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleDeletePost = () => {
    dispatch(deletePost({ post, auth }));
    setShowDelete(false);
  };

  return (
    <div className="deletePost_modal">
      <div className="deletePost_modal_container">
        <div className="deletePost_modal_title">
          <h4>Xóa bài viết?</h4>
          <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
        </div>
        <div className="deletePost_modal_action">
          <button
            className="btn w-100"
            style={{
              color: "var(--primary-color)",
              fontWeight: "600",
            }}
            onClick={handleDeletePost}
          >
            Xóa
          </button>
          <button className="btn w-100" onClick={() => handleDeletePost(false)}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;
