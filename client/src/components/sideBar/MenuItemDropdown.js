import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { logout } from "../../redux/actions/authAction";

const MenuItemDropdown = () => {
  const [show, setShow] = useState(false);
  const theme = useSelector((state) => state.theme);
  const developer = useSelector((state) => state.developer);
  const dispatch = useDispatch();

  return (
    <div className="dropdown w-100 px-1 py-2">
      <p
        className="text-center d-flex align-items-center mb-0 dropdown-title"
        onClick={() => setShow(!show)}
      >
        <span className="material-icons me-2">menu</span>
        <span className="dropdown-text">Xem thêm</span>
      </p>
      {show && (
        <ul className="dropdown-menu mb-1 p-2">
          <li>
            <Link
              className="dropdown-item px-2 py-3 d-flex align-items-center"
              to={"/setting"}
            >
              <span className="material-icons">settings</span>
              <span className="nav-text ms-3">Đổi mật khẩu</span>
            </Link>
          </li>
          <li>
            {/* <Link
              className="dropdown-item px-2 py-3 d-flex align-items-center"
              to={"/"}
            >
              <span className="material-icons">show_chart</span>
              <span className="nav-text ms-3">Hoạt động của bạn</span>
            </Link> */}
          </li>
          <li>
            <label
              className="dropdown-item px-2 py-3 d-flex align-items-center"
              htmlFor="theme"
              onClick={() =>
                dispatch({ type: GLOBAL_TYPES.THEME, payload: !theme })
              }
            >
              <span className="material-icons">
                {theme ? "light_mode" : "dark_mode"}
              </span>
              <span className="nav-text ms-3">
                Giao diện {theme ? "sáng" : "tối"}
              </span>
            
            </label>
          </li>
          <li>
            <label
              className="dropdown-item px-2 py-3 d-flex align-items-center"
              htmlFor="developer"
              onClick={() =>
                dispatch({ type: GLOBAL_TYPES.DEVELOPER, payload: !developer })
              }
            >
              <span className="material-icons">
                {!developer ? "code" : "person"}
              </span>
              <span className="nav-text ms-3">
                Chế độ {!developer ? "lập trình viên" : "người dùng"}
              </span>
            
            </label>
          </li>
          <li>
            <Link
              className="dropdown-item px-2 py-3 d-flex align-items-center"
              to={"/"}
            >
              <span className="material-icons">report</span>
              <span className="nav-text ms-3">Báo cáo sự cố</span>
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <Link className="dropdown-item px-2 py-3 " to={"/"} onClick={() => dispatch(logout)}>
              Đăng xuất
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MenuItemDropdown;
