import React, { useState } from "react";
import { Link } from "react-router-dom";
import Images from "../images";
import logo from "../images/logo.svg";
const Login = () => {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;
  const [typePass, setTypePass] = useState(false);
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="auth_page">
      <img src={Images.frames} alt="Cover" className="auth_frames" />
      <div className="login_from-register">
        <form className="auth_form">
          <img src={logo} alt="Logo" className="auth_logo" />
          <div className="mb-3 ">
            <input
              placeholder="Email"
              type="email"
              className=" auth_input"
              id="email"
              onChange={handleChangeInput}
              value={email}
              name="email"
            />
          </div>
          <div className="mb-3 form_input">
            <input
              placeholder="Mật khẩu"
              type={typePass ? "text" : "password"}
              className="auth_input"
              id="password"
              onChange={handleChangeInput}
              value={password}
              name="password"
            />
            <small className="show-hide" onClick={() => setTypePass(!typePass)}>
              {typePass ? "Ẩn" : "Hiển thị"}
            </small>
          </div>
          <button
            type="submit"
            className="btn btn-login"
            disabled={email && password ? false : true}
          >
            Đăng nhập
          </button>
          <div className="separate">
            <div className="separate-line"></div>
            <div className="separate-text">HOẶC</div>
            <div className="separate-line"></div>
          </div>
          <a href="" className="login_facebook">
            <i className="fa-brands fa-facebook me-1 login_facebook-img" />
            <div className="login_facebook-text">Đăng nhập với Facebook</div>
          </a>
          <a className="login_forgot">Quên mật khẩu</a>
        </form>
        <div className="auth_footer">
          Bạn chưa có tài khoản{" "}
          <Link className="ms-1 auth_footer-link" to="/register">
            Đăng ký
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};

export default Login;
