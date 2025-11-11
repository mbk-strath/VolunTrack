import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/volunteer/MessagesPage.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/my-notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.notifications || [];

      setMessages(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setMessages([]); // ✅ Ensure messages is always an array
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/mark-as-read/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? { ...msg, is_read: true, read_at: new Date().toISOString() }
            : msg
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/send-notification`,
        {
          message: newMessage,
          receiver_id: receiverId,
          channel: "in_app",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Notification sent successfully!");
      setMessages((prev) => [res.data.notification, ...prev]);
      setNewMessage("");
      setReceiverId("");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="messages-page">
      <h2>My Notifications</h2>

      {loading ? (
        <p>Loading notifications...</p>
      ) : Array.isArray(messages) && messages.length > 0 ? (
        <div className="messages-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-card ${msg.is_read ? "read" : "unread"}`}
            >
              <p>{msg.message}</p>
              <small>
                Sent at: {new Date(msg.sent_at).toLocaleString()} | Channel:{" "}
                {msg.channel}
              </small>
              {!msg.is_read && (
                <button onClick={() => markAsRead(msg.id)}>Mark as Read</button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No notifications yet.</p>
      )}

      <div className="send-form">
        <h3>Send Notification</h3>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Receiver ID"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
          />
          <textarea
            placeholder="Type your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default MessagesPage;
