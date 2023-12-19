import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../redux/actions/authAction";

const Setting = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = () => {
    const data = {password: currentPassword, confirmPassword: confirmNewPassword , newPassword: newPassword };
    dispatch(changePassword({data, auth}));
  };
  return (
    <div className="container mt-5 changePasswordPage">
      <h2>Đổi mật khẩu</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="currentPassword" className="form-label">
           Mật khẩu hiện tại
          </label>
          <input
            type="password"
            className="form-control"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            Mật khẩu mới
          </label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmNewPassword" className="form-label">
            Xác nhận lại mật khẩu mới
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary btn_changePass"
          onClick={handleChangePassword}
          disabled={
            !currentPassword ||
            !newPassword ||
            newPassword !== confirmNewPassword
          }
        >
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default Setting;
