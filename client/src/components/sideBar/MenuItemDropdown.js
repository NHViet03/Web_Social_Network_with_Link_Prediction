import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";

const MenuItemDropdown = () => {
  const [show, setShow] = useState(false);
  const { theme } = useSelector((state) => state);
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
              to={"/"}
            >
              <span className="material-icons">settings</span>
              <span className="nav-text ms-3">Cài đặt</span>
            </Link>
          </li>
          <li>
            <Link
              className="dropdown-item px-2 py-3 d-flex align-items-center"
              to={"/"}
            >
              <span className="material-icons">show_chart</span>
              <span className="nav-text ms-3">Hoạt động của bạn</span>
            </Link>
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
                Chế độ {theme ? "sáng" : "tối"}
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
            <Link className="dropdown-item px-2 py-3" to={"/"}>
              Đăng xuất
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MenuItemDropdown;
