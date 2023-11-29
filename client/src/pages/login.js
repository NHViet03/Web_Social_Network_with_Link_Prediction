import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Images from "../images";
import logo from "../images/auth/logo-2.png";
import { login } from '../redux/actions/authAction'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from "react-router-dom";
const Login = () => {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;
  const firstLogin = localStorage.getItem("firstLogin");
  const dispatch = useDispatch();

  const {auth} = useSelector(state=> state)
  const navigate=useNavigate();
   useEffect(() =>{
    if(auth.token) navigate('/')
   },[auth.token, navigate])


  const [typePass, setTypePass] = useState(false);
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData))
  }

  return (
    <div className="auth_page">
      <img src={Images.frames} alt="Cover" className="auth_frames" />
      <div className="login_from-register">
        <form className="auth_form" onSubmit={handleSubmit}>
            <img src={logo} alt="Logo" className="mb-3 login_logo w-100" />
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
            {/* <small className="show-hide" onClick={() => setTypePass(!typePass)}>
              {typePass ? "Ẩn" : "Hiển thị"}
            </small> */}
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
          <a href="#" className="login_facebook">
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
