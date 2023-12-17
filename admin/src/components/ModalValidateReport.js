import React, { useState } from "react";
import moment from "moment";

const ModalValidateReport = ({ report, setShowModal, handleValidate }) => {
  const [deletePost, setDeletePost] = useState(false);
  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    await handleValidate({ report, deletePost });
    setShowModal(false);
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
            <i className="fa-solid fa-user-check me-2" />
            Xác thực báo cáo - {report.id}
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
          <div className="mb-2">
            <span
              className="fw-medium d-inline-block"
              style={{
                minWidth: "120px",
              }}
            >
              Mã bài viết:{" "}
            </span>
            <span>{report.id}</span>
          </div>
          <div className="mb-2">
            <span
              className="fw-medium d-inline-block"
              style={{
                minWidth: "120px",
              }}
            >
              Người đăng:{" "}
            </span>
            <span>
              {report.post.user.username} - {report.post.user.fullname}
            </span>
          </div>
          <div className="mb-2">
            <span
              className="fw-medium d-inline-block"
              style={{
                minWidth: "120px",
              }}
            >
              Người báo cáo:{" "}
            </span>
            <span>{report.reporter.username}</span>
          </div>
          <div className="mb-2">
            <span
              className="fw-medium d-inline-block"
              style={{
                minWidth: "120px",
              }}
            >
              Lý do báo cáo:{" "}
            </span>
            <span>{report.reason}</span>
          </div>
          <div className="mb-2">
            <span
              className="fw-medium d-inline-block"
              style={{
                minWidth: "120px",
              }}
            >
              Thời gian báo cáo:{" "}
            </span>
            <span>{moment(report.createdAt).format("LLL")}</span>
          </div>
          <div className="form-check d-flex align-items-center gap-2 mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              value={deletePost}
              onChange={(e) => setDeletePost(e.target.checked)}
              id="include_post"
              style={{
                width: "20px",
                height: "20px",
              }}
            />
            <label
              className="form-check-label fw-medium "
              style={{
                color: "var(--primary-color)",
              }}
              for="include_post"
            >
              Bao gồm xóa bài viết
            </label>
          </div>
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
          <button className="btn btn_normal btn_accept" onClick={handleSubmit}>
            Xác thực
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalValidateReport;
