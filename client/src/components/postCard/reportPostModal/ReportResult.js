import React from "react";
import { useSelector } from "react-redux";
import { unfollow } from "../../../redux/actions/profileAction";

const ReportResult = ({ setShowReport, post, auth, dispatch }) => {
  const profile = useSelector((state) => state.profile);
  const socket = useSelector((state) => state.socket);

  const handleUnfollow = () => {
    dispatch(unfollow({ users: profile.users, user: post.user, auth, socket }));
  };

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
      {post.user._id !== auth.user._id &&
        auth.user.following.find((item) => item._id === post.user._id) && (
          <div className="reportPost_modal_card w-100 mt-3">
            <p className="mb-0" onClick={handleUnfollow}>
              Bỏ theo dõi{" "}
              <span className="text_primary">{post.user.username}</span>
            </p>
            <i className="fa-solid fa-angle-right" />
          </div>
        )}
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
