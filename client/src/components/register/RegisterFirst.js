import React, { useState } from "react";
import logo from "../../images/logo.svg";

const RegisterFirst = ({ userData, setUserData,setRegisterStep }) => {
  const { email, fullname, username, password } = userData;
  const [typePass, setTypePass] = useState(false);
  
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData((preUserData) => ({ ...preUserData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegisterStep(preStep=>preStep+1);
  };

  return (
    <form
      className="d-flex justify-content-center flex-column pt-4 auth_form "
      onSubmit={handleSubmit}
    >
      <img src={logo} alt="Logo" className="mb-2" />
      <p className="mb-3 auth_intro">Đăng ký để xem ảnh và video từ bạn bè.</p>
      <button class="btn btn_primary w-100">
        <i className="fa-brands fa-square-facebook me-1"></i>
        Đăng nhập bằng Facebook
      </button>
      <div className="separate my-3">
        <div className="separate-line"></div>
        <div className="separate-text">HOẶC</div>
        <div className="separate-line"></div>
      </div>
      <div className="mb-3 form-floating">
        <input
          placeholder="Email"
          type="email"
          className=" form-control auth_input "
          id="email"
          onChange={handleChangeInput}
          value={email}
          name="email"
        />
        <label htmlFor="email">Email</label>
      </div>
      <div className="mb-3 form-floating">
        <input
          placeholder="Tên đầy đủ"
          type="text"
          className=" form-control auth_input"
          id="fullname"
          onChange={handleChangeInput}
          value={fullname}
          name="fullname"
        />
        <label htmlFor="fullname">Tên đầy đủ</label>
      </div>
      <div className="mb-3 form-floating">
        <input
          placeholder="Tên người dùng"
          type="text"
          className="form-control auth_input"
          id="username"
          onChange={handleChangeInput}
          value={username}
          name="username"
        />
        <label htmlFor="username">Tên người dùng</label>
      </div>

      <div className="mb-3 form-floating form_input">
        <input
          placeholder="Mật khẩu"
          type={typePass ? "text" : "password"}
          className="form-control auth_input"
          id="password"
          onChange={handleChangeInput}
          value={password}
          name="password"
        />
        <label htmlFor="password">Mật khẩu</label>
        <small className="show-hide" onClick={() => setTypePass(!typePass)}>
          {typePass ? "Ẩn" : "Hiển thị"}
        </small>
      </div>
      <span className="auth_sub-intro mb-3">
        Bằng cách đăng ký, bạn đồng ý với{" "}
        <a className="text_primary">Điều khoản</a>,{" "}
        <a className="text_primary">Chính sách quyền riêng tư</a> và{" "}
        <a className="text_primary">Chính sách cookie</a> của chúng tôi.
      </span>
      <button type="submit" className="btn btn_primary w-100">
        Đăng ký
      </button>
    </form>
  );
};

export default RegisterFirst;
