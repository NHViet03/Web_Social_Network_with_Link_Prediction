import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import MenuItem from "./MenuItem";
import { ModalSideBarContext } from "./SideBar";
import { useLocation } from "react-router-dom";
import { getDataAPI } from "../../utils/fetchData";
import { MESS_TYPES } from "../../redux/actions/messageAction";

const SideBar = () => {
  const auth = useSelector((state) => state.auth);
  const notify = useSelector((state) => state.notify);
  const message = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const { isShowSearch, setIsShowSearch, isShowNotify, setIsShowNotify } =
    useContext(ModalSideBarContext);
  const [active, setActive] = useState(-1);
  const { pathname } = useLocation();

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

  const handleShowAddModal = useCallback(() => {
    dispatch({
      type: GLOBAL_TYPES.ADD_POST_MODAL,
      payload: true,
    });
  }, [dispatch]);

  const handleClickMenuItem = (index) => {
    setIsShowSearch(false);
    setIsShowNotify(false);
    setActive(index);
  };

  useEffect(() => {
    const fetchNumberNewMessage = async () => {
      try {
        const res = await getDataAPI('numberNewMessage', auth.token);
        dispatch({
          type: MESS_TYPES.NUMBERNEWMESSAGE,
          payload: res.data.numberNewMessage,
        });
      } catch (err) {
        console.error(err);
      }
    };
  
    if (auth.token) {
      fetchNumberNewMessage();
    }
  }, [message.numberNewMessage, auth.token]);

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
        numberNewMessage: message.numberNewMessage,
      },
      {
        label: "Thông báo",
        icon: "favorite_border",
        active: "favorite",
        newNotify:
          notify.notifies.filter((notify) => notify.isRead === false).length >
          0,
        onClick: handleShowNotify,
      },
      {
        label: "Tạo",
        icon: "add_box",
        onClick: handleShowAddModal,
      },
      {
        label: "Trang cá nhân",
        avatar: auth.user.avatar,
        path: `/profile/${auth.user._id}`,
      },
    ],
    [
      auth.user._id,
      auth.user.avatar,
      handleShowAddModal,
      handleShowNotify,
      handleShowSearch,
      notify.notifies,
    ]
  );

  useEffect(() => {
    const copyLinks = [...navLinks];

    const index = copyLinks.reverse().findIndex((link) => {
      if (link.path) {
        return pathname.replace("/", "").includes(link.path.replace("/", ""));
      } else {
        return false;
      }
    });

    if (index !== -1) {
      setActive(copyLinks.length - 1 - index);
    }
  }, []);

  return (
    <div className="menu">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-column">
        {navLinks.map((link, index) => (
           <React.Fragment key={index}>
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
                className={`nav-item mb-3 p-2 ${
                  link.label === "Tìm kiếm" && isShowSearch ? "active" : ""
                }
                ${link.label === "Thông báo" && isShowNotify ? "active" : ""}
                `}
                onClick={link.onClick}
                style={{
                  cursor: "pointer",
                }}
              >
                <div className="d-flex align-items-center ">
                  <div className="position-relative">
                    <span className="material-icons nav-icon ">
                      {link.label === "Thông báo" && isShowNotify
                        ? link.active
                        : link.icon}
                    </span>
                    {link.label === "Thông báo" && link.newNotify && (
                      <i
                        className="fa-solid fa-circle position-absolute"
                        style={{
                          color: "var(--primary-color)",
                          top: 0,
                          right: "2px",
                          fontSize: "8px",
                          border: "1px solid #fff",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </div>

                  <span className="nav-text ms-3">{link.label}</span>
                </div>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
