import React, { useState } from "react";
import "./LegalCompanionPage.css";

const LegalCompanionPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you legally today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, sender: "user" }];

    // Dummy bot response
    let botReply = "I'm not sure I understand. Could you please clarify?";
    if (input.toLowerCase().includes("complain")) {
      botReply =
        "You can file a complaint by providing details such as your name, issue, and location. Would you like me to guide you through the process?";
    }

    setMessages([...newMessages, { text: botReply, sender: "bot" }]);
    setInput("");
  };

  return (
    <div className="legal-companion-container">
      <h2 className="title">Legal Companion - Chat with KanoonSaathi</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Ask your legal question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default LegalCompanionPage;
