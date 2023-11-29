import React, { useState } from "react";
import moment from "moment";
import cake from "../../images/cake.png";
import { renderOptionSelect } from "../../utils/renderDate";

const RegisterSecond = ({ userData, setUserData, setRegisterStep }) => {
  const initialState = {
    month: 1,
    day: 1,
    year: 2023,
  };
  const [date, setDate] = useState(initialState);
  const { month, day, year } = date;
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setDate({ ...date, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const birthday=moment(new Date(year,month-1,day)).format('L'); 
    setUserData({...userData,birthday})
    setRegisterStep(preStep=>preStep+1);
  };

  return (
    <form
      className="d-flex justify-content-center flex-column pt-4 auth_form"
      onSubmit={handleSubmit}
    >
      <img src={cake} alt="Logo" className="mb-3 register-thumbnail" />
      <p className="mb-3 auth_intro">Thêm ngày sinh</p>
      <p className="mb-3 text-center">
        Thông tin này sẽ không hiển thị trên trang cá nhân công khai của bạn.
      </p>
      <div className="mb-3 d-flex justify-content-around align-content-center gap-3 text-center">
        <select class="form-select" name="month" onChange={handleChangeInput} >
          {renderOptionSelect("month")}
        </select>
        <select class="form-select" name="day" onChange={handleChangeInput}>
          {renderOptionSelect("day", year,month)}
        </select>
        <select class="form-select"  name="year" onChange={handleChangeInput}>
        {renderOptionSelect("year", year)}
        </select>
      </div>

      <span className="mb-3 text-center auth_sub-intro">
        Bạn cần nhập ngày sinh của mình
      </span>
      <span className="auth_sub-intro mb-3">
        Hãy thêm ngày sinh của chính bạn, dù đây là tài khoản dành cho doanh
        nghiệp, thú cưng hay bất cứ điều gì khác
      </span>

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
  );
};

export default RegisterSecond;
