import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/volunteer/MessagesPage.css"; // We will create this CSS file next

function NotificationsVolPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all notifications for the logged-in user
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) {
        setError("You are not authenticated.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:8000/api/my-notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // --- START OF FIX ---
        // NEW: Check if response.data is actually an array
        // This prevents the ".sort() is not a function" error
        const notificationsData = Array.isArray(response.data)
          ? response.data
          : [];

        // Sort by date, newest first
        const sortedNotifications = notificationsData.sort(
          (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
        );
        // --- END OF FIX ---

        setNotifications(sortedNotifications);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError(
          err.response?.data?.message || "Could not load notifications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  // Handle marking a notification as "read"
  const handleMarkAsRead = async (notificationId) => {
    try {
      // 1. Call the API to update the database
      await axios.put(
        `http://localhost:8000/api/mark-as-read/${notificationId}`,
        {}, // PUT request needs an empty body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 2. Update the state locally to make the UI feel fast
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      // You could show a small popup error here if you want
    }
  };

  // --- Render Logic ---
  if (loading) return <p className="notif-loading">Loading notifications...</p>;
  if (error) return <p className="notif-error">{error}</p>;

  return (
    <div className="notifications-page">
      <h2>My Notifications</h2>

      {notifications.length === 0 ? (
        <p className="notif-empty">You have no new notifications.</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${
                notif.is_read ? "read" : "unread"
              }`}
            >
              <div className="notification-content">
                <p>{notif.message}</p>
                <span className="notification-date">
                  {new Date(notif.sent_at).toLocaleString()}
                </span>
              </div>

              {!notif.is_read && (
                <button
                  className="btn-mark-read"
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsVolPage;
