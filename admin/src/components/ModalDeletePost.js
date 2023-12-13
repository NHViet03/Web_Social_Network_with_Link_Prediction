import React from "react";

const ModalDeletePost = ({ post, setShowModalDelete }) => {
  const handleClose = () => {
    setShowModalDelete(false);
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
          <i className="fa-solid fa-delete-left me-2"/>
            Xóa bài viết - {post.user.username}</h6>
          <button
            className="btn"
            onClick={handleClose}
            style={{
              border: "none",
            }}
          >
            <i className="fa-solid fa-xmark"/>
          </button>
        </div>
        <div className="modal_body"></div>
        <div
          className="modal_footer"
          style={{
            marginRight: "12px",
          }}
        >
          <button className="btn btn_normal" onClick={handleClose}>
            Hủy
          </button>
          <button className="btn btn_normal btn_accept" >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeletePost;
