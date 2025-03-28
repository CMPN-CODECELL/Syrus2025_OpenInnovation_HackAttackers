import React, { useState } from "react";
import axios from "axios";
import "./DocumentSummariserPage.css"; 

const DocumentSummariserPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/summarize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarizing the document:", error);
      alert("Failed to summarize the document.");
    }
    setLoading(false);
  };

  return (
    <div className="doc-summary-container">
      <div className="doc-summary-card">
        <h2>📄 Document Summariser</h2>
        <p>Upload a legal document (PDF, DOCX, TXT) to generate a summary.</p>

        <label className="file-upload">
          <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
          <span>📂 Choose a File</span>
        </label>

        {selectedFile && <p className="file-name">✅ {selectedFile.name}</p>}

        <button className="upload-btn" onClick={handleUpload} disabled={loading}>
          {loading ? "Summarizing..." : "📤 Upload & Summarize"}
        </button>

        {summary && (
          <div className="summary-box">
            <h3>🔍 Summary:</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSummariserPage;
