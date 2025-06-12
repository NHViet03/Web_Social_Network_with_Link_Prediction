import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import policyData from "../utils/policyData";

import { useSelector, useDispatch } from "react-redux";
import { deletePost } from "../redux/actions/postAction";

const ModalDeletePost = ({ post, setShowModalDelete }) => {
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleClose = () => {
    setShowModalDelete(false);
  };

  const handleDelete = async () => {
    await dispatch(deletePost({ post, reason, auth }));
    setShowModalDelete(false);
    navigate(-1);
  };

  return (
    <div className="modal_custom">
      <div
        className="modal_content"
        style={{
          width: "600px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center modal_header">
          <h6 className="fw-medium">
            <i className="fa-solid fa-delete-left me-2" />
            Xóa bài viết - {post.user.username}
          </h6>
          <button
            className="btn"
            onClick={handleClose}
            style={{
              border: "none",
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="modal_body">
          <h6 className="fw-medium post_detail_modal_card">
            Lý do bạn xóa bài viết này?
          </h6>
          {policyData.map((policy) => (
            <div
              key={policy.id}
              className={`post_detail_modal_card ${
                policy.content === reason && "active"
              }`}
              onClick={() => setReason(policy.content)}
            >
              <p>{policy.content}</p>
              <i className="fa-solid fa-angle-right" />
            </div>
          ))}
        </div>
        <div
          className="modal_footer"
          style={{
            marginRight: "12px",
          }}
        >
          <button className="btn btn_normal" onClick={handleClose}>
            Hủy
          </button>
          <button className="btn btn_normal btn_accept" onClick={handleDelete}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeletePost;
