import React from "react";
import Avatar from "react-avatar";

function UserProfile({ name, avatar, className, showName = true, size = 40 }) {
  return (
    <div className={`user-profile ${className}`}>
      <Avatar
        name={name}
        src={avatar}
        size={size}
        round={true}
        className="avatar"
      />
      {showName && <span>{name}</span>}
    </div>
  );
}

export default UserProfile;
