import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FacebookLogin from "react-facebook-login";

import Images from "../images";
import logo from "../images/auth/logo-2.png";
import { login } from "../redux/actions/authAction";
import getClientInfo from "../utils/getClientInfo";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const deviceInfo = await getClientInfo();

    dispatch(
      login({
        ...userData,
        deviceInfo: deviceInfo,
      })
    );
  };

  const handleFacebookCallback = async (response) => {
    if (response?.status === "unknown") {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: "Xin lỗi! Đã xảy ra lỗi khi đăng nhập bằng Facebook.",
        },
      });
      return;
    }

    const deviceInfo = await getClientInfo();

    dispatch(
      login({
        email: response.email,
        isFacebook: true,
        accessToken: response.accessToken,
        deviceInfo: deviceInfo,
      })
    );
  };

  return (
    <div className="auth_page">
      <img src={Images.frames} alt="Cover" className="auth_frames" />
      <div className="login_from-register">
        <form className="auth_form " onSubmit={handleSubmit}>
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
          <FacebookLogin
            buttonStyle={{
              border: "none",
              backgroundColor: "transparent",
              textAlign: "center",
              fontWeight: "500",
              fontSize: "16px",
              width: "100%",
            }}
            cssClass="login_facebook"
            textButton="Đăng nhập với Facebook"
            icon="fa-brands fa-facebook"
            appId="1270760671135470"
            autoLoad={false}
            fields="name,email,picture"
            callback={handleFacebookCallback}
          />
        </form>
        <div className="auth_footer">
          <div>
            Bạn chưa có tài khoản{" "}
            <Link className="ms-1 auth_footer-link " to="/register">
              Đăng ký
            </Link>{" "}
          </div>
          <div>
            <Link className="login_forgot" to="/forgotpassword">
              Quên mật khẩu?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
