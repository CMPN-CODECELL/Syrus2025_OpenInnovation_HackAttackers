import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFileDownload, FaEye } from "react-icons/fa";
import apiService from "../services/apiService";
import "./DocumentRetrievalPage.css";

const DocumentRetrievalPage = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await apiService.getAllDocuments();
        setDocuments(data.docs);
      } catch (err) {
        setError(err.message || "Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const filteredDocs = documents.filter(
    (doc) =>
      (selectedCategory === "All" || doc.category === selectedCategory) &&
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewSummary = (doc) => {
    navigate(`/document-summary/${doc.id}`, { state: { doc } });
  };

  return (
    <div className="document-container">
      <h2 className="title">📜 Legal Document Retrieval</h2>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-bar"
          placeholder="Search for a document..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="document-grid">
        {loading && <p>Loading documents... ⏳</p>}
        {error && <p>⚠️ {error}</p>}

        {!loading &&
          filteredDocs.map((doc) => (
            <div key={doc.id} className="document-card">
              <h3>{doc.name}</h3>
              <p>📂 Category: {doc.category}</p>

                <div className="document-actions">
                  {/* Download Button */}
                  <a href={doc.url} download className="document-btn">
                    <FaFileDownload /> Download
                  </a>

                  {/* View Summary Button */}
                  <button
                    onClick={() => handleViewSummary(doc)}
                    className="document-btn"
                  >
                    <FaEye /> View Summary
                  </button>
                </div>

              <small>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</small>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DocumentRetrievalPage;










