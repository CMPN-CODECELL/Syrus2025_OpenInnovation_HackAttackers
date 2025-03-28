import React, { useState } from "react";
import axios from "axios";
import "./LegalCompanionPage.css";

const API_KEY = "AIzaSyAMrKz2dIHwDHCE330nLPXrxMUn-FA74gc"; 

const LegalCompanionPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you legally today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {

      const systemPrompt = `You are a legal advisor dont include you should consult with a domestic violence attorney or a legal aid organization. You are the legal advisor for the given input query. Provide a concise and well-formatted response to the following query: \n\n"${input}"`;

      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
        }
      );

      const botReply =
        response.data?.candidates[0]?.content?.parts[0]?.text ||
        "I'm not sure I understand. Could you please clarify?";

      const botMessage = { text: botReply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Failed to fetch response. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="legal-companion-container">
      <h2 className="title">Legal Companion - Chat with KanoonSaathi</h2>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br>') }}></span>
          </div>
        ))}
        {loading && <div className="message bot">Loading...</div>}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Ask your legal question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default LegalCompanionPage;
