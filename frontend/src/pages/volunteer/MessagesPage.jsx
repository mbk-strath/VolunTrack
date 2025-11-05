import React, { useState } from "react";
import "../../styles/volunteer/MessagesPage.css";

const MessagesPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Your application has been approved!",
      sent_at: "2025-10-29T10:00:00.000000Z",
      is_read: false,
      channel: "email",
    },
    {
      id: 2,
      message: "A new volunteering event is available.",
      sent_at: "2025-11-01T09:30:00.000000Z",
      is_read: true,
      channel: "in_app",
    },
    {
      id: 3,
      message: "Your report was reviewed successfully.",
      sent_at: "2025-11-02T15:20:00.000000Z",
      is_read: false,
      channel: "in_app",
    },
  ]);

  // Mark message as read
  const markAsRead = (id) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg))
    );
  };

  // Simulate sending a message
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    const newMsg = {
      id: messages.length + 1,
      message: newMessage,
      sent_at: new Date().toISOString(),
      is_read: false,
      channel: "in_app",
    };
    setMessages([newMsg, ...messages]);
    setNewMessage("");
    setReceiverId("");
    alert("✅ Dummy message added!");
  };

  return (
    <div className="messages-page">
      <h2>My Messages</h2>

      <div className="messages-list">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => (
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
          ))
        )}
      </div>

      <div className="send-form">
        <h3>Send a Message</h3>
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
