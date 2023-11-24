import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import SelectImage from "./ShowImages";
import Avatar from "../Avatar";

function WriteContent({ post, setPost }) {
  const auth = useSelector((state) => state.auth);
  const [showEmoji, setShowEmoji] = useState(false);

  const contentRef = useRef();

  const handleEmojiSelect = (emoji) => {
    setPost({
      ...post,
      content: post.content + emoji.native,
    });
    contentRef.current.focus();
  };

  return (
    <div className="d-flex justify-content-between">
      <SelectImage post={post} />
      <div className="write_content">
        <div className="d-flex align-items-center mt-3 px-3">
          <Avatar src={auth.user.avatar} size="avatar-xs" />
          <span
            style={{
              fontWeight: 500,
              marginLeft: "12px",
            }}
          >
            {auth.user.username}
          </span>
        </div>
        <textarea
          ref={contentRef}
          value={post.content}
          onChange={(e) =>
            setPost({
              ...post,
              content: e.target.value,
            })
          }
          placeholder="Viết chú thích..."
        />
        <div className="d-flex px-3 align-items-center justify-content-between">
          <div className="form-emoji">
            <i
              className="fa-regular fa-face-grin"
              onClick={() => setShowEmoji(!showEmoji)}
            />

            {showEmoji && (
              <div className="form-emoji-picker">
                <Picker
                  data={data}
                  previewPosition="none"
                  searchPosition="none"
                  theme="light"
                  set="native"
                  locale="vi"
                  perLine="7"
                  maxFrequentRows={14}
                  emojiSize={28}
                  navPosition="bottom"
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
            )}
          </div>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-color)",
            }}
          >
            {post.content.length}/200
          </span>
        </div>
      </div>
    </div>
  );
}

export default WriteContent;
