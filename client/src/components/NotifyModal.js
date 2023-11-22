import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import FollowButton from "./FollowButton";
import Avatar from "./Avatar";

function NotifyModal() {
  const notify = useSelector((state) => state.notify);

  return (
    <div className="sideBar_modal notify_modal">
      <h3>Thông báo</h3>
      <div className="notify_content">
        <h6>Tháng này</h6>
        {notify.notifies.map((item, index) => (
          <div className="mb-3 notify_card">
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
            <FollowButton />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotifyModal;
