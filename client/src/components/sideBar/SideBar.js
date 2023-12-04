import React, { useState, useEffect, createContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Menu from "./Menu";
import logoImg from "../../images/logo.svg";
import logoSmallImg from "../../images/logo.png";
import MenuItemDropdown from "./MenuItemDropdown";
import SearchModal from "../SearchModal";
import NotifyModal from "../NotifyModal";


export const ModalSideBarContext = createContext(null);

const SideBar = () => {
  const auth=useSelector(state=>state.auth);
  const { pathname } = useLocation();
  const [logo, setLogo] = useState(logoImg);
  const [isSmall, setIsSmall] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [isShowNotify, setIsShowNotify] = useState(false);
  const theme = useSelector((state) => state.theme);

 

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
    if (isShowSearch || isShowNotify ) setLogo(logoSmallImg);
    else setLogo(logoImg);
  }, [isShowNotify, isShowSearch]);

  if(!auth.token) return null;
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <ModalSideBarContext.Provider
      value={{ isShowSearch, setIsShowSearch, isShowNotify, setIsShowNotify }}
    >
      <div
        className={`col-3 side-bar ${isSmall || isShowSearch || isShowNotify ||pathname==='/message' ? "small" : ""}`}
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

          <SearchModal isShowSearch={isShowSearch} setIsShowSearch={setIsShowSearch}/>
          <NotifyModal isShowNotify={isShowNotify}/>
        </div>
      </div>
    </ModalSideBarContext.Provider>
  );
};

export default SideBar;
