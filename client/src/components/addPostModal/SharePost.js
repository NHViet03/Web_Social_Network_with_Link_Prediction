import React from "react";
import successGif from "../../images/success.gif";
import loadGif from "../../images/load.gif";

function SharePost({ loading }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100">
      <img
        src={loading ? loadGif : successGif}
        alt="success"
        style={{
          objectFit: "cover",
        }}
      />
      {!loading && (
        <p
          style={{
            marginTop: "16px",
            fontSize: "20px",
          }}
        >
          Đã chia sẻ bài viết của bạn.
        </p>
      )}
    </div>
  );
}

export default SharePost;
