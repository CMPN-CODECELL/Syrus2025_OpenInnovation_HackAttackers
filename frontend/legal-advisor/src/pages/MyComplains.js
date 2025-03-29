import React, { useEffect, useState } from "react";
import "./MyComplains.css";

const MyComplains = () => {
  const [chatLogs, setChatLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchChatLogs = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:5000/api/get-chat-logs/${userId}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        setChatLogs(data.chat_logs);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatLogs();
  }, [userId]);

  return (
    <div className="complains-container">
      <h2 className="title">My Queries</h2>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your queries...</p>
        </div>
      ) : chatLogs.length === 0 ? (
        <div className="empty-state">
          <p className="no-complains">No queries found</p>
          <p className="empty-subtext">Your recent interactions will appear here</p>
        </div>
      ) : (
        <div className="complains-list">
          {chatLogs.map((log) => (
            <div key={log.timestamp} className="complain-card">
              <div className="card-header">
                <span className="timestamp">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
              <div className="card-content">
                <div className="query-section">
                  <h3 className="section-label">Query</h3>
                  <p className="query-text">{log.query}</p>
                </div>
                <div className="response-section">
                  <h3 className="section-label">Response</h3>
                  <p className="response-text">{log.response}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplains;