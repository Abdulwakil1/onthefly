import React from "react";
import "./Avatar.css";

const Avatar = ({ user, className }) => {
  return (
    <div className={`Avatar ${className || ""}`}>
      <img className="user-img" src={user.avatarurl} alt="Profile" />
    </div>
  );
};

export default Avatar;
