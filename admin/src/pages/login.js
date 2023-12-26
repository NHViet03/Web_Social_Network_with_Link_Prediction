import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Frames from "../images/frames.png";
import logo from "../images/logo.png";

import { login } from "../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.token) navigate("/");
  }, [auth.token, navigate]);

  const [typePass, setTypePass] = useState(false);
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData));
  };

  return (
    <div className="auth_page">
      <img src={Frames} alt="Cover" className="auth_frames" />
      <div className="login_from-register">
        <form className=" auth_form" onSubmit={handleSubmit}>
          <img src={logo} alt="Logo" className="mb-5 login_logo w-100" />
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
        </form>
      </div>
    </div>
  );
};

export default Login;
