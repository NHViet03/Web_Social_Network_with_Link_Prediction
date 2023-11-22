import React, { useState, useMemo, useCallback, useContext } from "react";
import { useSelector } from "react-redux";
import MenuItem from "./MenuItem";
import { ModalSideBarContext } from "./SideBar";

const SideBar = () => {
  const auth = useSelector((state) => state.auth);
  const { isShowSearch, setIsShowSearch, isShowNotify, setIsShowNotify } =
    useContext(ModalSideBarContext);
  const [active, setActive] = useState(-1);

  const handleShowSearch = useCallback(() => {
    setActive(-1);
    setIsShowNotify(false);
    setIsShowSearch(!isShowSearch);
  }, [isShowSearch, setIsShowNotify, setIsShowSearch]);

  const handleShowNotify = useCallback(() => {
    setActive(-1);
    setIsShowSearch(false);
    setIsShowNotify(!isShowNotify);
  }, [isShowNotify, setIsShowNotify, setIsShowSearch]);

  const navLinks = useMemo(
    () => [
      {
        label: "Trang chủ",
        icon: "home",
        path: "/",
      },
      {
        label: "Tìm kiếm",
        icon: "search",
        onClick: handleShowSearch,
      },
      {
        label: "Khám phá",
        icon: "explore",
        path: "/explore",
      },
      {
        label: "Tin nhắn",
        icon: "send",
        path: "/message",
      },
      {
        label: "Thông báo",
        icon: "favorite_border",
        active: "favorite",
        onClick: handleShowNotify,
      },
      {
        label: "Tạo",
        icon: "add_box",
        path: "/add",
      },
      {
        label: "Trang cá nhân",
        avatar: auth.avatar,
        path: `/profile/${auth._id}`,
      },
    ],
    [auth._id, auth.avatar, handleShowNotify, handleShowSearch]
  );

  const handleClickMenuItem = (index) => {
    setIsShowSearch(false);
    setIsShowNotify(false);
    setActive(index);
  };

  return (
    <div className="menu">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-column">
        {navLinks.map((link, index) => (
          <>
            {link.path ? (
              <div onClick={() => handleClickMenuItem(index)}>
                <MenuItem
                  link={link}
                  active={active === index ? true : ""}
                  key={index}
                />
              </div>
            ) : (
              <li
                className={`nav-item my-2 p-2 ${
                  link.label === "Tìm kiếm" && isShowSearch ? "active" : ""
                }
                ${link.label === "Thông báo" && isShowNotify ? "active" : ""}
                `}
                onClick={link.onClick}
              >
                <div className="d-flex align-items-center">
                  <span className="material-icons nav-icon">
                    {link.label === "Thông báo" && isShowNotify
                      ? link.active
                      : link.icon}
                  </span>
                  <span className="nav-text ms-3">{link.label}</span>
                </div>
              </li>
            )}
          </>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
