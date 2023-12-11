import React, { useState, useMemo } from "react";
import { useTimer } from "react-timer-hook";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";

const StoryModal = ({ story, setIsShowStoryModal }) => {
  const [input, setInput] = useState("");

  const time = useMemo(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 5);
    return time;
  }, []);

  const { totalSeconds, isRunning, pause, resume } = useTimer({
    expiryTimestamp: time,
    autoStart: true,
    onExpire: () => setIsShowStoryModal(false),
  });

  const handleChangeInput = (e) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      pause();
    } else {
      resume();
    }
  };

  return (
    <div className="story_modal">
      <i
        className="fa-solid fa-xmark close_icon"
        onClick={() => setIsShowStoryModal(false)}
      />
      <div className="story_modal-list">
        <div className="story_modal_card">
          <div className="story_modal_card-header">
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${100 - (parseFloat(totalSeconds) / 5) * 100}%`,
                  height: "100%",
                  backgroundColor: "#fff",
                }}
              />
            </div>
            <div className="story_modal_card-header-content">
              <Link
                to={`/profile/${story._id}`}
                className="d-flex align-items-center"
              >
                <Avatar src={story.avatar} size="avatar-sm" />
                <span className="ms-2">{story.username}</span>
              </Link>
              <div>
                {isRunning ? (
                  <i
                    className="fa-solid fa-pause"
                    style={{
                      marginRight: "16px",
                    }}
                    onClick={pause}
                  />
                ) : (
                  <i
                    className="fa-solid fa-play"
                    style={{
                      marginRight: "16px",
                    }}
                    onClick={resume}
                  />
                )}
                <i className="fa-solid fa-ellipsis" />
              </div>
            </div>
          </div>
          <div
            className="story_modal_card-body"
            style={{
              opacity: input.length > 0 ? "0.8" : "1",
            }}
          >
            <img src={story.avatar} alt="Story" />
          </div>

          <div className="d-flex justify-content-between gap-3 align-items-center story_modal_card-footer">
            <input
              type="text"
              className="form-control flex-1"
              placeholder={`Trả lời ${story.username}...`}
              value={input}
              onChange={handleChangeInput}
            />
            <i className="fa-regular fa-heart" />
            <i className="fa-regular fa-paper-plane" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
