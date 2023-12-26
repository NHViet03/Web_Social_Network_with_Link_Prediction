import React from "react";

const Avatar = (props) => {
  return (
    <div
      className={`avatar-container ${props.size} ${
        props.border ? "avatar-border" : ""
      } ${props.primary ? "avatar-primary" : ""}`}
    >
      <img className="avatar" src={props.src} alt="Avatar" />
    </div>
  );
};

export default Avatar;
