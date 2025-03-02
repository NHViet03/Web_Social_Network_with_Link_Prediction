import React, { useEffect, useState } from "react";
import gmail from "../../src/images/gmail.png";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  forgotPasswordChangePassword,
  forgotPasswordVerifyOTP,
  resendOTP,
  verifyOTP,
} from "../redux/actions/authAction";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";

const ForgotPasswordChangePassword = () => {
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // Compare new password and confirm password
    if (newPassword !== confirmPassword) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: "Mật khẩu xác nhận không khớp",
        },
      });
      return;
    }
    var userID = localStorage.getItem("userID");
    dispatch(forgotPasswordChangePassword(userID, newPassword));
  };

  return (
    <div className="auth_page">
      <form
        className="d-flex justify-content-center flex-column pt-4 auth_form"
        onSubmit={handleSubmit}
      >
        <p className="mb-3 auth_intro fs-4">Nhập mật khẩu mới</p>

        <div className="mb-3 form-floating">
          <input
            placeholder="Mật khẩu mới"
            type="password"
            className=" form-control auth_input "
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label htmlFor="email">Mật khẩu mới</label>
        </div>
        <div className="mb-3 form-floating">
          <input
            placeholder="Nhập lại mật khẩu mới"
            type="password"
            className=" form-control auth_input "
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label htmlFor="email">Nhập lại mật khẩu mới</label>
        </div>

        <button type="submit" className="btn btn_primary w-100 mb-3">
          Gửi
        </button>
        <Link to="/" className="text_primary text-center step_back">
          Quay lại Trang chủ
        </Link>
      </form>
    </div>
  );
};

export default ForgotPasswordChangePassword;
