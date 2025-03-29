import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./LegalCompanionPage.css";

const LegalCompanionPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm KanoonSaathi, your personal legal companion. How may I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("Anonymous");
  const chatBoxRef = useRef(null);
  
  // Get user_id from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  
  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      // Using the backend chatbot API instead of direct Gemini API
      const response = await axios.post(
        "http://localhost:5000/api/chatbot", // Assuming your backend is served from the same origin
        {
          user_id: userId,
          query: input
        }
      );
      
      const botReply = response.data?.response || 
        "I'm not sure I understand. Could you please clarify?";
        
      const botMessage = { text: botReply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "I apologize, but I'm unable to process your request at the moment. Please try again later.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Format messages to handle markdown-like syntax
  const formatMessage = (text) => {
    // Bold text between ** markers
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic text between * markers
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Line breaks
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return formattedText;
  };
  
  return (
    <div className="legal-companion-container">
      <h2 className="title">KanoonSaathi - Your Legal Companion</h2>
      
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}></span>
          </div>
        ))}
        {loading && <div className="message bot loading">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>}
      </div>
      
      <div className="input-container">
        <input
          type="text"
          placeholder="Ask your legal question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !loading && handleSendMessage()}
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default LegalCompanionPage;