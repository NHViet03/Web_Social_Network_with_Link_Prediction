import React from "react";
import { Link, useLocation } from "react-router-dom";
import MenuItem from "./MenuItem";

const SideBar = () => {
  const navLinks = [
    {
      label: "Trang chủ",
      icon: "home",
      path: "/",
    },
    {
      label: "Tìm kiếm",
      icon: "search",
      path: "/search",
    },
    {
      label: "Khám phá",
      icon: "explore",
      path: "/explore",
    },
    {
      label: "Tin nhắn",
      icon: "near_me",
      path: "/message",
    },
    {
      label: "Thông báo",
      icon: "favorite",
      path: "/notify",
    },
    {
      label: "Tạo",
      icon: "add_box",
      path: "/add",
    },
    {
      label: "Trang cá nhân",
      icon: "account_circle",
      path: "/profile/abc",
    },
  ];
  const { pathname } = useLocation();

  return (
    <div className="menu">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-column">
        {navLinks.map((link, index) => (
          <MenuItem link={link} active={pathname === link.path ? true : ""} key={index} />
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
