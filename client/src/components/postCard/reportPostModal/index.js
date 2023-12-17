import React, { useState } from "react";
import ReportReason from "./ReportReason";
import ReportResult from "./ReportResult";
import Loading from "../../Loading";

import { useSelector, useDispatch } from "react-redux";
import { reportPost } from "../../../redux/actions/postAction";

const ReportPostModal = ({ postData, setShowReport }) => {
  const [post, setPost] = useState(postData);
  const [reason, setReason] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleReport = async () => {
    if (loading) return;
    setLoading(true);
    await dispatch(reportPost({ post, reason, auth }));
    setLoading(false);
    setStep(2);
  };

  return (
    <div className="reportPost_modal">
      <div className="reportPost_modal_container">
        <header className="fw-medium fs-6 text-center ">Báo cáo</header>
        <i
          className="fa-solid fa-xmark position-absolute"
          style={{
            top: "12px",
            right: "12px",
            fontSize: "24px",
            cursor: "pointer",
          }}
          onClick={() => setShowReport(false)}
        />
        {loading && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              height: "358px",
            }}
          >
            <Loading />
          </div>
        )}

        {!loading && step === 1 ? (
          <ReportReason
            reason={reason}
            setReason={setReason}
            setShowReport={setShowReport}
            handleReport={handleReport}
          />
        ) : (
          !loading && (
            <ReportResult
              setShowReport={setShowReport}
              post={post}
              auth={auth}
              dispatch={dispatch}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ReportPostModal;
