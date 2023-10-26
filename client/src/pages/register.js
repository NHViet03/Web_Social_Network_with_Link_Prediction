import React, { useState } from "react";
import { Link,useNavigate} from "react-router-dom";

import RegisterFirst from "../components/register/RegisterFirst";
import RegisterSecond from "../components/register/RegisterSecond";
import RegisterThird from "../components/register/RegisterThird";

const Register = () => {
  const initialState = {
    email: "",
    fullname: "",
    username: "",
    password: "",
    birthday: "",
  };
  const [userData, setUserData] = useState(initialState);
  const [registerStep, setRegisterStep] = useState(1);
  const navigate=useNavigate();

  const renderRegisterStep = () => {
    switch (registerStep) {
      case 1:
        return (
          <RegisterFirst
            userData={userData}
            setUserData={setUserData}
            setRegisterStep={setRegisterStep}
          />
        );
      case 2:
        return (
          <RegisterSecond
            userData={userData}
            setUserData={setUserData}
            setRegisterStep={setRegisterStep}
          />
        );
      case 3:
        return (
          <RegisterThird
            userData={userData}
            setUserData={setUserData}
            setRegisterStep={setRegisterStep}
          />
        );
      case 4:
          return navigate('/')
      default:
        return <div></div>;
    }
  };

  return (
    <div className="auth_page my-3 d-flex flex-column">
      {renderRegisterStep()}
      <div className="auth_footer">
        Bạn có tài khoản ?{" "}
        <Link className="ms-1 auth_footer-link" to="/login">
          Đăng nhâp
        </Link>{" "}
      </div>
    </div>
  );
};

export default Register;