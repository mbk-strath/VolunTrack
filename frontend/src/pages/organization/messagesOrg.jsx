import React, { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import "../../styles/volunteer/MessagesPage.css";
import { FaMicrophone } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import { FaPaperPlane } from "react-icons/fa";

function MessagesOrg() {
  const [messages, setMessages] = useState([
    { text: "Hey there! How are you?", sender: "other" },
    { text: "I'm good, thanks! You?", sender: "me" },
    { text: "Doing great, just working on a project.", sender: "other" },
  ]);

  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "me" }]);
    setInput("");
  };

  const onEmojiClick = (emojiData) => {
    setInput(input + emojiData.emoji);
  };

  const handleVoice = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        setAudioChunks([]);

        mediaRecorder.ondataavailable = (e) => {
          setAudioChunks((prev) => [...prev, e.data]);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setMessages((prev) => [
            ...prev,
            { type: "audio", url: audioUrl, sender: "me" },
          ]);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied:", err);
        alert("Please allow microphone access to record voice notes.");
      }
    }
  };
  return (
    <div className="chat-app">
      {/* Sidebar */}
      <div className="side">
        <input
          type="text"
          placeholder="Search messages..."
          className="search-contact"
        />
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
        <div className="chat-header">
          <div className="avatar"></div>
          <p className="name">Mary Doe</p>
        </div>

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
          <button onClick={() => setShowEmoji(!showEmoji)}>
            <BsEmojiSmile className="icon-msg" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleVoice}
            style={{
              color: isRecording ? "red" : "black",
            }}
          >
            <FaMicrophone className="icon-msg" />
          </button>
          <button onClick={handleSend}>
            <FaPaperPlane className="icon-msg" />
          </button>

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

export default MessagesOrg;
