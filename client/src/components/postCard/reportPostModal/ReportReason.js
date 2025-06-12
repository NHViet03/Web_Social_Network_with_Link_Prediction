import policyData from "../../../utils/policyData";

const ReportReason = ({ report, setReport, setShowReport, handleReport }) => {
  return (
    <div className="my-3">
      <h6 className="fw-medium mb-0 reportPost_modal_card">
        Lý do bạn báo cáo bài viết này?
      </h6>
      {policyData.map((policy) => (
        <div
          key={policy.id}
          className={`reportPost_modal_card ${
            policy.id === report?.id && "active"
          }`}
          onClick={() => setReport(policy)}
        >
          <p className="mb-0">{policy.content}</p>
          <i className="fa-solid fa-angle-right" />
        </div>
      ))}
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
