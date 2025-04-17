import React, { useEffect, useState } from "react";
import gmail from "../../src/images/gmail.png";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPassword, resendOTP, verifyOTP } from "../redux/actions/authAction";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
    
  };

  return (
    <div className="auth_page">
      <form
        className="d-flex justify-content-center flex-column pt-4 auth_form"
        onSubmit={handleSubmit}
      >
        <img src={gmail} alt="Logo" className="mb-3 register-thumbnail" />
        <p className="mb-3 auth_intro">Nhập Email tài khoản của bạn</p>

        <div className="mb-3 form-floating">
          <input
            placeholder="Email của bạn"
            type="email"
            className=" form-control auth_input "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">Email của bạn</label>
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

export default ForgotPassword;
