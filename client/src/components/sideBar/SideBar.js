import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Menu from "./Menu";
import logo from "../../images/auth/logo-2.png";
import MenuItemDropdown from "./MenuItemDropdown";

const SideBar = () => {
  const { pathname } = useLocation();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <div className="side-bar col-3 d-flex justify-content-center flex-column">
      <nav className="nav_bar navbar-expand-lg">
        <Link to="/" className="logo">
          <img
            src={logo}
            alt="Logo"
            className="mx-auto mb-3 d-block side-bar-logo"
            style={{height: "80px", width: "200px"}}
          />
        </Link>
        <Menu />
      </nav>
      <MenuItemDropdown />
    </div>
  );
};

export default SideBar;
