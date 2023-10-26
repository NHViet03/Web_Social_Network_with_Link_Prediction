import React from "react";
import { Link } from "react-router-dom";

const MenuItem = ({ link, active }) => {
  return (
    <li className="nav-item my-2 px-2">
      <Link
        className={`nav-link ${
          active ? "active" : ""
        }  d-flex align-items-center`}
        to={link.path}
      >
        <span className="material-icons nav-icon">{link.icon}</span>
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
