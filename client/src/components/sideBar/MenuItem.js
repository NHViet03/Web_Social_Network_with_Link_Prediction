import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "../Avatar";

const MenuItem = ({ link, active }) => {
  const { theme } = useSelector((state) => state);

  return (
    <li className="nav-item my-2 px-2">
      <Link
        className={`nav-link ${
          active ? "active" : ""
        }  d-flex align-items-center`}
        to={link.path}
        style={{ filter: active && theme ? "invert(1)" : "invert(0)" }}
      >
        {link.avatar ? (
          <Avatar src={link.avatar} size="avatar-sm" />
        ) : (
          <span className="material-icons nav-icon">
            {active ? (link.active ? link.active : link.icon) : link.icon}
          </span>
        )}
        <span
          className="nav-text ms-3"
          style={{ fontWeight: active ? "500" : "" }}
        >
          {link.label}
        </span>
      </Link>
    </li>
  );
};

export default MenuItem;
