import React from "react";
import "../../styles/main/notifications.css";

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { id, message, is_read, sent_at, channel } = notification;

  return (
    <div className={`notification-item ${is_read ? "read" : "unread"}`}>
      <div className="notification-content">
        <p className="message">{message}</p>
        <small className="meta">
          Channel: {channel || "in_app"} • {new Date(sent_at).toLocaleString()}
        </small>
      </div>
      {!is_read && (
        <button className="mark-read-btn" onClick={() => onMarkAsRead(id)}>
          Mark as read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
