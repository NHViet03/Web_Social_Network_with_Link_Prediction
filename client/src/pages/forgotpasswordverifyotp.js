import React, { useEffect, useState } from "react";
import gmail from "../../src/images/gmail.png";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPasswordVerifyOTP, resendOTP, verifyOTP } from "../redux/actions/authAction";

const ForgotPasswordVerifyOTP = () => {
  const dispatch = useDispatch();
  const [otpcode, setOtpcode] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    var userID = localStorage.getItem("userID");
    dispatch(forgotPasswordVerifyOTP(userID, otpcode));
  };

  const handleResendOTP = () => {
    var userID = localStorage.getItem("userID");
    dispatch(resendOTP(userID));
  };
  return (
    <div className="auth_page">
      <form
        className="d-flex justify-content-center flex-column pt-4 auth_form"
        onSubmit={handleSubmit}
      >
        <img src={gmail} alt="Logo" className="mb-3 register-thumbnail" />
        <p className="mb-3 auth_intro">Nhập mã xác nhận</p>
        <p className="mb-3 text-center">
          Nhập mã xác nhận mà chúng tôi đã gửi đến địa chỉ {"email"}{" "}
          <span
            className="text_primary register-third-resend-otp"
            style={{ cursor: "pointer" }}
            onClick={handleResendOTP}
          >
            Gửi lại mã
          </span>
          .
        </p>

        <div className="mb-3 form-floating">
          <input
            placeholder="Mã xác nhận"
            type="number"
            className=" form-control auth_input "
            value={otpcode}
            onChange={(e) => setOtpcode(e.target.value)}
          />
          <label htmlFor="email">Mã xác nhận</label>
        </div>

        <button type="submit" className="btn btn_primary w-100 mb-3">
          Tiếp
        </button>
        <Link to="/" className="text_primary text-center step_back">
          Quay lại
        </Link>
      </form>
    </div>
  );
};

export default ForgotPasswordVerifyOTP;
