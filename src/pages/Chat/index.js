import React, { useEffect, useState } from "react";
import "./main.css";
import { useData } from "../../hooks/userData";
import { useNavigate } from "react-router";
const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello, how can I help you today?", isBot: 1 },
  ]);
  const [inputValue, setInputValue] = useState("");
  const { userData } = useData({});
  const navigate = useNavigate();

  // 자동 스크롤
  useEffect(() => {
    var divdiv = document.getElementById("mess");

    divdiv.scrollTop = divdiv.scrollHeight;
  }, [messages]);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputValue !== "") {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: inputValue, isBot: 0 },
      ]);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <section className="container">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <button
            className="chatbot-header-close"
            onClick={() => {
              navigate(-1);
            }}
          >
            &#8592;
          </button>
          <div className="chatbot-header-text">Chatbot</div>
          <img
            className="user-img"
            src={userData.photoURL}
            alt={userData.displayName}
          ></img>
        </div>
        <div className="chatbot-messages" id="mess">
          {messages.map((message) => (
            <div
              key={message.id}
              className="chatbot-message"
              style={{
                alignSelf: message.isBot ? "flex-start" : "flex-end",
              }}
            >
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
    </section>
  );
};

export default Chatbot;
