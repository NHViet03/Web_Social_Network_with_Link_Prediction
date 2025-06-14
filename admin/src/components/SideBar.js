import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions/authAction";
import Logo from "../images/logo.png";

function SideBar({ showSideBar }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [active, setActive] = useState(0);
  const MenuItems = useMemo(
    () => [
      {
        title: "Trang chủ",
        icon: "fa-solid fa-house-user",
        link: "/",
      },
      {
        title: "Bài viết",
        icon: "fa-solid fa-image",
        link: "/posts",
      },
      {
        title: "Người dùng",
        icon: "fa-solid fa-user-group",
        link: "/users",
      },
      {
        title: "Báo cáo",
        icon: "fa-solid fa-user-shield",
        link: "/reports",
      }
    ],
    []
  );

  const { pathname } = useLocation();

  if (pathname === "/login" || !auth.token) return null;

  const resetActive = () => {
    setActive(-1);
  };

  const handleLogout = () => {
    dispatch(logout);
  };

  return (
    <div className={`side_bar ${showSideBar ? "active" : ""}`}>
      <div className="side_bar-logo">
        <img src={Logo} alt="Logo" />
      </div>
      <hr className="divider" />
      <nav className="navbar">
        <ul className="navbar-nav d-flex flex-col">
          {MenuItems.map((item, index) => (
            <li key={index} className="nav-item mb-3">
              <Link
                to={item.link}
                className={`nav-link ${active === index ? "active" : ""}`}
                onClick={() => setActive(index)}
              >
                <span className="icon_wrapper">
                  <i className={item.icon} />
                </span>
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
          <span
            className="my-4"
            style={{
              color: "rgba(0, 0, 0, 0.54)",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            TRANG TÀI KHOẢN
          </span>
          <li className="nav-item mb-3">
            <button className={`nav-link`} onClick={handleLogout}>
              <span className="icon_wrapper">
                <i class="fa-solid fa-right-from-bracket" />
              </span>
              <span>Đăng xuất</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SideBar;
