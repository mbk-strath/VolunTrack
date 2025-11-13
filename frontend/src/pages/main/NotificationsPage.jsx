import React, { useEffect, useState } from "react";
import NotificationItem from "../../components/main/NotificationItem";
import {
  getMyNotifications,
  getUnreadNotifications,
  markAsRead,
  sendNotification,
} from "../../services/notificationService";
import "../../styles/main/notifications.css";

const NotificationsPage = () => {
  // Get logged-in user info
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase() || "volunteer";

  const [notifications, setNotifications] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [filter, setFilter] = useState("all"); // all | unread
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let data;
      if (filter === "unread") {
        data = await getUnreadNotifications();
      } else {
        data = await getMyNotifications();
      }

      // ✅ Ensure it's always an array
      const list = Array.isArray(data) ? data : data.notifications || [];

      setNotifications(list);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !receiverId) return;

    try {
      const payload = {
        message: newMessage,
        receiver_id: receiverId,
        channel: "in_app",
      };
      await sendNotification(payload);
      alert("✅ Notification sent successfully!");
      setNewMessage("");
      setReceiverId("");
      fetchNotifications();
    } catch (err) {
      console.error("Error sending notification:", err);
      alert("❌ Failed to send notification. Please try again.");
    }
  };

  return (
    <div className="notifications-page">
      <h1>Notifications</h1>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "unread" ? "active" : ""}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
      </div>

      {/* Send Form (Only for Organisations) */}
      {role === "organisation" && (
        <form className="send-form" onSubmit={handleSendNotification}>
          <input
            type="text"
            placeholder="Notification message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Receiver (Volunteer) ID"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
          />
          <button type="submit">Send</button>
        </form>
      )}

      {/* Notifications List */}
      <div className="notifications-list">
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="empty">No notifications to display.</p>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
