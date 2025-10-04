import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "../../styles/volunteer/MessagesPage.css";

function MessagesPage() {
  const [messages, setMessages] = useState([
    { text: "Hey there! How are you?", sender: "other" },
    { text: "I'm good, thanks! You?", sender: "me" },
    { text: "Doing great, just working on a project.", sender: "other" },
  ]);

  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "me" }]);
    setInput("");
  };

  const onEmojiClick = (emojiData) => {
    setInput(input + emojiData.emoji);
  };

  return (
    <div className="chat-app">
      {/* Sidebar */}
      <div className="side">
        <input type="text" placeholder="Search messages..." />
        <div className="contacts">
          <div className="contact active">
            <div className="avatar"></div>
            <div>
              <p className="name">Mary Doe</p>
              <p className="last-msg">Remember to book your appointment...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">Mary Doe</div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center" }}>
              No messages yet
            </p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.sender === "me" ? "me" : "other"}`}
              >
                <span>{msg.text}</span>
              </div>
            ))
          )}
        </div>

        <div className="chat-input">
          <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>➤</button>

          {showEmoji && (
            <div className="emoji-picker">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
