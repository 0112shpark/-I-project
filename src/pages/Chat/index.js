import React, { useState } from "react";
import "./main.css";
import { useData } from "../../hooks/userData";
import { Navigate, useNavigate } from "react-router";
const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello, how can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const { handleSignout } = useData({});
  const navigate = useNavigate();

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputValue !== "") {
      setMessages([...messages, { id: messages.length + 1, text: inputValue }]);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <body>
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="chatbot-header-text">Chatbot</div>
          <div className="buttons__signout_chat" onClick={handleSignout}>
            Logout
          </div>
          <button
            className="chatbot-header-close"
            onClick={() => {
              navigate(-1);
            }}
          >
            X
          </button>
        </div>
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className="chatbot-message">
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleInputSubmit} className="chatbot-input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            className="chatbot-input"
          />
          <button type="submit" className="chatbot-send-button">
            Send
          </button>
        </form>
      </div>
    </body>
  );
};

export default Chatbot;
