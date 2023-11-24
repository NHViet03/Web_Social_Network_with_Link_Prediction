import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "../Avatar";

const MenuItem = ({ link, active }) => {
  const theme = useSelector((state) => state.theme);

  return (
    <li className={`nav-item mb-3 px-2  ${
      active ? "active" : ""
    }`}>
      <Link
        className={`nav-link d-flex align-items-center`}
        to={link.path}
        style={{ filter: active && theme ? "invert(1)" : "invert(0)" }}
      >
        {link.avatar ? (
          <Avatar
            src={link.avatar}
            size="avatar-xs"
            primary={active ? true : false}
          />
        ) : (
          <span
            className="material-icons nav-icon"
            style={{
              rotate: link.path === "/message" ? "-30deg" : "",
              marginLeft: link.path === "/message" ? "2px" : "",
            }}
          >
            {active ? (link.active ? link.active : link.icon) : link.icon}
          </span>
        )}
        <span
          className="nav-text ms-3"
          style={{ fontWeight: active ? "500" : "", marginTop:link.path === "/message" ? "6px" : "",}}
          
        >
          {link.label}
        </span>
      </Link>
    </li>
  );
};

export default MenuItem;
