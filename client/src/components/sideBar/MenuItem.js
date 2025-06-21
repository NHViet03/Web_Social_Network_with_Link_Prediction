import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "../Avatar";

const MenuItem = ({ link, active }) => {
  const theme = useSelector((state) => state.theme);

  return (
    <li className={`nav-item mb-4 px-2  ${active ? "active" : ""}`}>

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
          <>
            <span
              className="material-icons nav-icon"
              style={{
                rotate: link.path === "/message" ? "-30deg" : "",
                transform:
                  link.path === "/message" ? "translate(3px,-2px)" : "",
              }}
            >
              {active ? (link.active ? link.active : link.icon) : link.icon}
            </span>
            {link.path === "/message" && link.numberNewMessage != 0 && !active &&(
              <div
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                fontSize: "12px",
                fontWeight: "500",
                color: "#fff",
                backgroundColor: "var(--primary-color)",
                padding: "2px 5px",
                borderRadius: "5px",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
              }}
              >{link.numberNewMessage}</div>
            )}
          </>
        )}
        <span
          className="nav-text ms-3"
          style={{
            fontWeight: active ? "500" : "",
            marginTop: link.path === "/message" ? "6px" : "",
          }}
        >
          {link.label}
        </span>
      </Link>
    </li>
  );
};

export default MenuItem;
