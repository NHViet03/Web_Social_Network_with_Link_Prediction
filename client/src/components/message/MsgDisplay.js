import React from 'react';
import Avatar from '../Avatar';
import { imageShow, videoShow } from '../../utils/mediaShow';
import { use } from 'react';
import { useEffect } from 'react';

const MsgDisplay = ({ user, msg, theme }) => {
  useEffect(() => {
    if (msg) {
      console.log(msg);
    }
  }, [msg]);
  return (
    <>
      {msg && (
        <>
          <div className="chat_title">
            <Avatar src={user.avatar} size="avatar-sm"></Avatar>
          </div>
         {msg.text && ( <div className="chat_text">{msg.text}</div>)}
          {msg.media.map((item, index) => (
            <div key={index} className="display_img_video_chat">
              {item.url.match(/video/i)
                ? videoShow(item.url, theme)
                : imageShow(item.url, theme)}
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
