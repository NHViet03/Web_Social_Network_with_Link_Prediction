import React from "react";
import { Link, useLocation } from "react-router-dom";
import {useSelector} from 'react-redux';
import Menu from "./Menu";
import logo from "../../images/logo.svg";
import MenuItemDropdown from "./MenuItemDropdown";

const SideBar = () => {
  const { pathname } = useLocation();
  const {theme}=useSelector(state=>state)
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <div className="side-bar col-3 d-flex justify-content-center flex-column">
      <nav className="nav_bar navbar-expand-lg">
        <Link to="/" className="logo">
          <img
            src={logo}
            alt="Logo"
            className="mx-auto mb-3 d-block side-bar-logo"
            onClick={()=>window.scrollTo(0,0)}
            style={{
              filter: theme ? "invert(1)" : "invert(0)",
            }}
          />
        </Link>
        <Menu />
      </nav>
      <MenuItemDropdown />
    </div>
  );
};

export default SideBar;
