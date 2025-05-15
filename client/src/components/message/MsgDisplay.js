import React from 'react';
import Avatar from '../Avatar';
import { imageShow, videoShow } from '../../utils/mediaShow';
import { useEffect, useState } from 'react';

const MsgDisplay = ({ user, msg, theme, yourmessage }) => {
  useEffect(() => {
    if (msg) {
    }
  }, [msg]);


  const [isOptionChat, setIsOptionChat] = useState(false);

  return (
    <>
      {msg && (
        <>
          <div className="chat_title">
            {msg.conversation.isGroup ? (
              <div style={{ display: "flex", gap: "10px", alignItems: "center", cursor: "pointer" }}>
              <Avatar src={msg.sender.avatar} size="avatar-sm"></Avatar>
              <p style={{marginBottom: "0px", fontSize: "13px", fontWeight: "500", color: theme.text }}>{msg.sender.username}</p>
              </div>
            ) : (
              <Avatar src={user.avatar} size="avatar-sm"></Avatar>
            )}
          </div>
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
                <div onClick={() => setIsOptionChat(!isOptionChat)}>...</div>
                {isOptionChat && (
                  <ul
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
                        <li>Chỉnh sửa</li>
                        <li>Thu hồi</li>
                      </>
                    ) : (
                      <li>Trả lời</li>
                    )}
                  </ul>
                )}
              </div>
              <div className="chat_text">{msg.text}</div>
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
