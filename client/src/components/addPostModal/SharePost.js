import React from "react";
import successGif from '../../images/success.gif'

function SharePost() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100">
      <img
        src={successGif}
        alt="success"
        style={{
          objectFit: "cover",
        }}
      />
      <p
        style={{
          marginTop: "16px",
          fontSize: "20px",
        }}
      >
        Đã chia sẻ bài viết của bạn.
      </p>
    </div>
  );
}

export default SharePost;
