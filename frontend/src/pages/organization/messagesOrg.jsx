import { useState, useRef } from "react";
import { Card, CardContent, TextField, IconButton, Avatar } from "@mui/material";
import { Search, Mic, Send, MoreVertical } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import "../../styles/organization/messagesOrg.css";

const MessagesOrg = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-grid">
        <Card className="messages-sidebar">
          <CardContent>
            <div className="messages-search-wrapper">
              <Search className="messages-search-icon" />
              <TextField
                placeholder="Search messages"
                variant="outlined"
                size="small"
                className="messages-search-input"
                fullWidth
              />
            </div>
            <div className="messages-list">
              {/* Message list would go here */}
            </div>
          </CardContent>
        </Card>

        <Card className="messages-chat">
          <div className="messages-chat-header">
            <Avatar className="messages-avatar" />
            <div className="messages-chat-info">
              <h3 className="messages-chat-name">Mary Doe</h3>
            </div>
            <IconButton>
              <MoreVertical className="messages-icon" />
            </IconButton>
          </div>

          <div className="messages-chat-body">
            {/* Messages would go here */}
          </div>

          <div className="messages-chat-footer">
            <div className="messages-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="messages-input"
              />
              <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <span className="messages-emoji-btn">😊</span>
              </IconButton>
              <IconButton>
                <Mic className="messages-icon" />
              </IconButton>
              <IconButton>
                <Send className="messages-icon" />
              </IconButton>
            </div>
            {showEmojiPicker && (
              <div className="messages-emoji-picker">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MessagesOrg;