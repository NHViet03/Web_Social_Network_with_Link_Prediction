import React, { useState, useEffect, createContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Menu from "./Menu";
import logoImg from "../../images/auth/logo-2.png";
import logoSmallImg from "../../images/logo.png";
import MenuItemDropdown from "./MenuItemDropdown";
import SearchModal from "../SearchModal";
import NotifyModal from "../NotifyModal";

export const ModalSideBarContext = createContext(null);

function useOutsideAlert(ref, setIsShowNotify, setIsShowSearch) {
  useEffect(() => {
    function handleClickOutSide(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsShowNotify(false);
        setIsShowSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutSide);

    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, [ref, setIsShowNotify, setIsShowSearch]);
}

const SideBar = () => {
  const auth = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const [logo, setLogo] = useState(logoImg);
  const [isSmall, setIsSmall] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [isShowNotify, setIsShowNotify] = useState(false);
  const theme = useSelector((state) => state.theme);

  const sideBarRef = useRef(null);
  useOutsideAlert(sideBarRef, setIsShowNotify, setIsShowSearch);

  useEffect(() => {
    const idEvent = window.addEventListener(
      "resize",
      function (event) {
        if (this.window.innerWidth <= 1024) {
          setLogo(logoSmallImg);
          setIsSmall(true);
        } else {
          setLogo(logoImg);
          setIsSmall(false);
        }
      },
      true
    );

    return () => window.removeEventListener("resize", idEvent);
  }, []);

  useEffect(() => {
    if (isShowSearch || isShowNotify || pathname.includes("/message"))
      setLogo(logoSmallImg);
    else setLogo(logoImg);
  }, [isShowNotify, isShowSearch, pathname]);

  if (!auth.token) return null;
  if (pathname === "/login" || pathname === "/register" || pathname.includes("/blockdevice")) return null;

  return (
    <ModalSideBarContext.Provider
      value={{ isShowSearch, setIsShowSearch, isShowNotify, setIsShowNotify }}
    >
      <div
        ref={sideBarRef}
        className={`col-3 side-bar ${
          isSmall ||
          isShowSearch ||
          isShowNotify ||
          pathname.includes("/message")
            ? "small"
            : ""
        }`}
      >
        <div className="position-relative  d-flex justify-content-between h-100 flex-column ">
          <nav className="nav_bar navbar-expand-lg">
            <Link to="/" className="logo mb-3">
              <img
                src={logo}
                alt="Logo"
                className="side-bar-logo"
                onClick={() => window.scrollTo(0, 0)}
                style={{
                  filter: theme ? "invert(1)" : "invert(0)",
                  width: logo === logoSmallImg ? "46px" : "100%",
                }}
              />
            </Link>
            <Menu />
          </nav>
          <MenuItemDropdown />

          <SearchModal
            isShowSearch={isShowSearch}
            setIsShowSearch={setIsShowSearch}
          />
          <NotifyModal isShowNotify={isShowNotify} setIsShowNotify={setIsShowNotify} />
        </div>
      </div>
    </ModalSideBarContext.Provider>
  );
};

export default SideBar;
