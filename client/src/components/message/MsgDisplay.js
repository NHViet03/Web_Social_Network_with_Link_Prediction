import React from "react";
import Avatar from "../Avatar";
import { imageShow, videoShow } from "../../utils/mediaShow";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MESS_TYPES, revokeMessage } from "../../redux/actions/messageAction";
import { useParams } from "react-router-dom";
import { useRef } from "react";

const MsgDisplay = ({
  user,
  msg,
  theme,
  yourmessage,
  isListenCLoseMsgDisplay,
}) => {
  useEffect(() => {
    setIsOptionChat(false);
  }, [isListenCLoseMsgDisplay]);

  const { auth, socket } = useSelector((state) => state);

  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOptionChat(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dispatch = useDispatch();
  const { id } = useParams();
  const [isOptionChat, setIsOptionChat] = useState(false);
  const handleReply = (msg) => {
    dispatch({
      type: MESS_TYPES.REPLY_MESSAGE,
      payload: msg,
    });
  };
  const handleEditMessage = (msg) => {
    dispatch({
      type: MESS_TYPES.EDIT_MESSAGE,
      payload: msg,
    });
  };
  const handleRevoke = (msg) => {
    msg = {
      ...msg,
      conversation: {
        idPath: id,
        isGroup: msg.conversation.isGroup,
        _id: msg.conversation._id,
      },
    };
    dispatch(revokeMessage({ auth, msg, socket }));
  };

  return (
    <>
      <div className="chat_title">
        {msg.conversation?.isGroup ? (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Avatar src={msg.sender.avatar} size="avatar-sm"></Avatar>
            <p
              style={{
                marginBottom: "0px",
                fontSize: "13px",
                fontWeight: "500",
                color: theme.text,
              }}
            >
              {msg.sender.username}
            </p>
          </div>
        ) : (
          <Avatar src={user.avatar} size="avatar-sm"></Avatar>
        )}
      </div>
      {msg && msg.replymessage && (
        <div className="reply_message">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "5px",
                fontSize: "13px",
                fontWeight: "500",
                color: theme.text,
              }}
            >
              <i class="fa fa-reply" aria-hidden="true"></i>
              <div>Đã trả lời tin nhắn của</div>
              <div>{msg.replymessage.sender.username}</div>
            </div>
            <div
              style={{
                fontSize: "13px",
                color: theme.text,
                backgroundColor: "#d97b5c3b",
                padding: "10px",
                borderRadius: "8px",
                maxWidth: "300px",
                wordBreak: "break-word",
                width: "100%",
              }}
            >
              {msg.replymessage.isRevoke ? "Đã thu hồi tin nhắn" :msg.replymessage.text}
            </div>
          </div>
        </div>
      )}
      {msg && (
        <>
          {msg.isEdit && (
            <div
              style={{
                fontSize: "13px",
                width: "fit-content",
                cursor: "pointer",
                color: "#0505056b",
              }}
            >
              Đã chỉnh sửa
            </div>
          )}

          {msg.isRevoke ? (
            <div
              style={{
                fontSize: "13px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #d97b5c",
                width: "fit-content",
                cursor: "pointer",
              }}
            >
              Đã thu hồi một tin nhắn
            </div>
          ) : (
            <div>
              {msg.text && (
                <div
                  className="d-flex"
                  style={{
                    ...(yourmessage
                      ? { flexDirection: "row", textAlign: "left" }
                      : { flexDirection: "row-reverse", textAlign: "right" }),
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <div onClick={() => setIsOptionChat(!isOptionChat)}>
                      ...
                    </div>
                    {isOptionChat && (
                      <ul
                        ref={dropdownRef}
                        style={{
                          ...(yourmessage ? { right: "0px" } : { left: "0px" }),
                        }}
                        onClick={() => {
                          setIsOptionChat(false);
                        }}
                        className="option_chat"
                      >
                        {yourmessage ? (
                          <>
                            <li onClick={() => handleEditMessage(msg)}>
                              Chỉnh sửa
                            </li>
                            <li onClick={() => handleRevoke(msg)}>Thu hồi</li>
                          </>
                        ) : (
                          <li onClick={() => handleReply(msg)}>Trả lời</li>
                        )}
                      </ul>
                    )}
                  </div>
                  <div className="chat_text">{msg.text}</div>
                </div>
              )}
            </div>
          )}
          {msg.media.map((item, index) => (
            <div key={index} className="display_img_video_chat">
              {item.url && item.url.match(/video/i)
                ? videoShow(item.url, theme)
                : imageShow(item.url || "", theme)}
            </div>
          ))}
          <div className="chat_time">
            {msg.createdAt === undefined
              ? new Date().toLocaleString()
              : new Date(msg.createdAt).toLocaleString()}
          </div>
        </>
      )}
    </>
  );
};

export default MsgDisplay;
