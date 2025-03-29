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
            const errorText = await response.text(); // Log the actual response
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
      <h2>My Queries</h2>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : chatLogs.length === 0 ? (
        <p className="no-complains">No complaints found.</p>
      ) : (
        <div className="complains-list">
          {chatLogs.map((log) => (
            <div key={log.timestamp} className="complain-card">
              <p className="query"><strong>Query:</strong> {log.query}</p>
              <p className="response"><strong>Response:</strong> {log.response}</p>
              <p className="timestamp">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplains;
