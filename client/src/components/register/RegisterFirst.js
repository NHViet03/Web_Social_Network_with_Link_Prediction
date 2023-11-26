import React, { useState } from "react";
import logo from "../../images/auth/logo-2.png";
import { register1 } from "../../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";

const RegisterFirst = ({ userData, setUserData,setRegisterStep }) => {
  const {alert} = useSelector(state=> state)
  const { email, fullname, username, password } = userData;
  const [typePass, setTypePass] = useState(false);
  const dispatch = useDispatch();
  
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData((preUserData) => ({ ...preUserData, [name]: value }));
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    dispatch(register1(userData));
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
          style={{backgroundColor: `${alert.email ? '#fd2d6a14' : ''}`}}
        />
        <label htmlFor="email">Email</label>
        <small className="form-text text-danger">
         {alert.email ? alert.email : ''}
        </small>
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
          style={{backgroundColor: `${alert.fullname ? '#fd2d6a14' : ''}`}}
        />
        <label htmlFor="fullname">Tên đầy đủ</label>
        <small className="form-text text-danger">
         {alert.fullname ? alert.fullname : ''}
        </small>
      </div>
      <div className="mb-3 form-floating">
        <input
          placeholder="Tên người dùng"
          type="text"
          className="form-control auth_input"
          id="username"
          onChange={handleChangeInput}
          value={username.toLowerCase().replace(/ /g, "")}
          name="username"
          style={{backgroundColor: `${alert.username ? '#fd2d6a14' : ''}`}}
        />
        <label htmlFor="username">Tên người dùng</label>
        <small className="form-text text-danger">
         {alert.username ? alert.username : ''}
        </small>
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
          style={{backgroundColor: `${alert.password ? '#fd2d6a14' : ''}`}}
        />
        <label htmlFor="password">Mật khẩu</label>
        {/* <small className="show-hide" onClick={() => setTypePass(!typePass)}>
          {typePass ? "Ẩn" : "Hiển thị"}
        </small> */}
        <small className="form-text text-danger">
         {alert.password ? alert.password : ''}
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
