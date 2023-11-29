import React, {useState} from "react";
import { UserCard } from "./UserCard";
import MsgDisplay from "./MsgDisplay";



const RightSide = () => {
  const [text, setText] = useState("");
  return (
    <div className="conversation-message">
      <div className="conversation-message_header">
        <UserCard isInRight />
        <div className="conversation-message_header-icon">
          <i class="fa-solid fa-phone"></i>
          <i class="fa-solid fa-video"></i>
          <i class="fa-solid fa-circle-info"></i>
        </div>
      </div>
      <div className="conversation-message_chat-container">
         <div className="conversation-message_chat-display">
            <div className="conversation-message_chat_row other_message">
              <MsgDisplay />
            </div>
            <div className="conversation-message_chat_row your-message">
              <MsgDisplay />
         </div>
         <div className="conversation-message_chat_row other_message">
              <MsgDisplay />
            </div>
            <div className="conversation-message_chat_row your-message">
              <MsgDisplay />
         </div>
         <div className="conversation-message_chat_row other_message">
              <MsgDisplay />
            </div>
            <div className="conversation-message_chat_row your-message">
              <MsgDisplay />
         </div>
         <div className="conversation-message_chat_row other_message">
              <MsgDisplay />
            </div>
            <div className="conversation-message_chat_row your-message">
              <MsgDisplay />
         </div>
         <div className="conversation-message_chat_row other_message">
              <MsgDisplay />
            </div>
            <div className="conversation-message_chat_row your-message">
              <MsgDisplay />
         </div>
          </div>
      </div>
      <form className="conversation-message_chat-input">
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Nhập tin nhắn..." />
        <button type="submit" className="conversation-message_chat-input-btn">
              <i class="fa-solid fa-microphone"></i>
              <i class="fa-regular fa-image"></i>
              <i class="fa-regular fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default RightSide;
