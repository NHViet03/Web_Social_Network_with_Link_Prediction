import React from "react";
import { useState } from "react";
import  img  from "../images";
const Login = () => {
  const inittialState = { email: "", password: "" };
  const [userData, setUserData] = useState(inittialState);
  const {email, password} = userData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({...userData, [name]: value})
  }

  return (
    <div className="login_page">
     <img src={img.frames} alt="" className="login_frames"/>
      <div className="login_from-register">
      <form className="login_form" >
      <img src={img.logo} alt="" className="login_logo"/>
        <div className="mb-3 ">
          <input 
            placeholder="Email"
            type="email"
            className=" login_input"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={handleChangeInput}
            value={email}
            name="email"
          />
        </div>
        <div className="mb-3">
          <input
            placeholder="Mật khẩu"
            type="password"
            className="login_input"
            id="exampleInputPassword1"
            onChange={handleChangeInput}
            value={password}
            name="password"
          />
        </div>
        <button type="submit" className="btn btn-color" disabled = {email && password ? false : true}>
          Đăng nhập
        </button>
        <div className="serapate">
          <div className="serapate-line"></div>
          <div className="serapate-text">OR</div>
          <div className="serapate-line"></div>
        </div>
        <a href="" className="login_facebook">
          <img src={img.facebook} className="login_facebook-img"  alt=""/>
          <div className="login_facebook-text" >Đăng nhập với Facebook</div>
        </a>
        <a className="login_forgot">Quên mật khẩu</a>
      </form>
      <div className="login_register">Bạn chưa có tài khoản <a className="login_register-link" href="/register">Đăng ký</a> </div>
      </div>
    </div>
  );
};

export default Login;
