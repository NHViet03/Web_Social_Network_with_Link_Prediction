import React from "react";
import moment from "moment";
import FollowButton from "./FollowButton";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { readNotify, deleteAllNotifies } from "../redux/actions/notifyAction";

function NotifyModal({ isShowNotify, setIsShowNotify }) {
  const notify = useSelector((state) => state.notify);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleReadNotify = (notify) => {
    setIsShowNotify(false);
    if (notify.isRead) return;
    dispatch(readNotify({ notify, auth }));
  };

  const handleDeleteAll = () => {
    if (notify.notifies.length === 0) return;
    dispatch(deleteAllNotifies(auth));
  };

  return (
    <div className={`sideBar_modal notify_modal ${isShowNotify && "show"}`}>
      <h3>Thông báo</h3>
      <div className="notify_content">
        {notify.notifies.length > 0 && (
          <p
            className="mb-2 text-end fw-medium"
            style={{
              color: "var(--primary-color)",
              cursor: "pointer",
            }}
            onClick={handleDeleteAll}
          >
            Xóa tất cả thông báo
          </p>
        )}
        <h6>Tháng này</h6>
        {notify.notifies.map((item, index) => (
          <Link
            to={`${item.url}`}
            onClick={() => handleReadNotify(item)}
            key={index}
            className="mb-3 notify_card"
          >
            <Avatar src={item.user.avatar} size="avatar-middle" />
            <p className="notify_card-content">
              <span
                style={{
                  fontWeight: "500",
                }}
              >
                {item.user.username}
              </span>
              {item.content}{" "}
              <span
                style={{
                  color: "var(--text-color)",
                }}
              >
                {moment(item.createdAt).fromNow()}
              </span>
            </p>
            {item.image ? (
              <img className="notify_card-img" src={item.image} alt="notify" />
            ) : (
              <FollowButton user={item.user} />
            )}
          </Link>
        ))}
        {notify.notifies.length === 0 && (
          <p className="text-center fw-medium mt-3">Không có thông báo nào</p>
        )}
      </div>
    </div>
  );
}

export default NotifyModal;
