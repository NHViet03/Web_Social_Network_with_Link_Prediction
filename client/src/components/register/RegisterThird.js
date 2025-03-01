import React, { useEffect } from "react";
import gmail from "../../images/gmail.png";
import { verifyOTP } from "../../redux/actions/authAction";
import { useDispatch } from "react-redux";

const RegisterThird = ({ userData, setUserData, setRegisterStep }) => {
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOTP(userID));
  };
  var userID;
  useEffect(() => {
    userID = localStorage.getItem("userID");
  }, []);

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
          <span className="text_primary" style={{ cursor: "pointer" }}>
            Gửi lại mã
          </span>
          .
        </p>

        <div className="mb-3 form-floating">
          <input
            placeholder="Mã xác nhận"
            type="email"
            className=" form-control auth_input "
            id="email"
            name="email"
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
