import React, { useEffect, useState } from "react";
import gmail from "../../images/gmail.png";
import { resendOTP, verifyOTP } from "../../redux/actions/authAction";
import { useDispatch } from "react-redux";

const RegisterThird = ({ userData, setUserData, setRegisterStep }) => {
  const dispatch = useDispatch();
  const [otpcode, setOtpcode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    var userID = localStorage.getItem("userID");
    dispatch(verifyOTP(userID, otpcode));
  };

  const handleResendOTP = () => {
    var userID = localStorage.getItem("userID");
    dispatch(resendOTP(userID));
  };
  return (
    <div>
      <form
        className="d-flex justify-content-center flex-column pt-4 auth_form"
        onSubmit={handleSubmit}
      >
        <img src={gmail} alt="Logo" className="mb-3 register-thumbnail" />
        <p className="mb-3 auth_intro">Nhập mã xác nhận</p>
        <p className="mb-3 text-center">
          Nhập mã xác nhận mà chúng tôi đã gửi đến địa chỉ {userData.email}{" "}
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
        <p
          className="text_primary text-center step_back"
          onClick={() => setRegisterStep((preStep) => preStep - 1)}
        >
          Quay lại
        </p>
      </form>
    </div>
  );
};

export default RegisterThird;
