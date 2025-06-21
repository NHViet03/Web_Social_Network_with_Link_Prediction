
const ReportResult = ({ setShowReport, }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-between my-3 px-3">
      <i
        className="fa-regular fa-circle-check mb-4"
        style={{
          color: "rgb(88, 195, 34)",
          fontSize: "48px",
        }}
      />
      <h6 className="fw-medium text-center">
        Cảm ơn bạn đã cho chúng tôi biết
      </h6>
      <p
        className="text-center mb-0"
        style={{
          color: "var(--text-color)",
        }}
      >
        Ý kiến đóng góp của bạn sẽ giúp ích rất nhiều cho chúng tôi trong việc
        bảo vệ cộng đồng Dreamers.
      </p>
      <button
        className="btn btn_normal btn_accept w-100 mt-4 "
        onClick={() => setShowReport(false)}
      >
        Đóng
      </button>
    </div>
  );
};

export default ReportResult;
