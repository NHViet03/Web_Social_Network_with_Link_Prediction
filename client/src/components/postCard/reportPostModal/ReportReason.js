import React, { useState } from "react";
import policyData from "../../../utils/policyData";

const ReportReason = ({ reason, setReason, setShowReport, handleReport }) => {
  const [showAnotherReason, setShowAnotherReason] = useState(false);

  return (
    <div className="my-3">
      <h6 className="fw-medium mb-0 reportPost_modal_card">
        Lý do bạn báo cáo bài viết này?
      </h6>
      {policyData.map((policy) =>
        policy.content !== "Khác" ? (
          <div
            key={policy.id}
            className={`reportPost_modal_card ${
              policy.content === reason && "active"
            }`}
            onClick={() => setReason(policy.content)}
          >
            <p className="mb-0">{policy.content}</p>
            <i className="fa-solid fa-angle-right" />
          </div>
        ) : (
          <div
            key={policy.id}
            className="reportPost_modal_card"
            onClick={() => {
              setShowAnotherReason(true);
              setReason("");
            }}
          >
            {showAnotherReason ? (
              <textarea
                className="form-control"
                autoFocus
                placeholder="Nhập lý do của bạn..."
                onChange={(e) => setReason(e.target.value)}
              />
            ) : (
              <p className="mb-0">{policy.content}</p>
            )}
          </div>
        )
      )}
      <div className="text-end mt-3 me-3">
        <button
          className="btn btn_normal me-3"
          onClick={() => setShowReport(false)}
        >
          Hủy
        </button>
        <button className="btn btn_normal btn_accept" onClick={handleReport}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ReportReason;
