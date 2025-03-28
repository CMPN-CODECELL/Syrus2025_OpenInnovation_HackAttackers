import React, { useState, useEffect } from "react";
import { FaSearch, FaFileDownload } from "react-icons/fa";
import apiService from "../services/apiService"; // Import API service
import "./DocumentRetrievalPage.css";

const DocumentRetrievalPage = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract unique categories from documents
  const extractCategories = (docs) => {
    const uniqueCategories = [
      "All",
      ...new Set(
        docs.map((doc) => doc.category).filter((cat) => cat !== "Nothing")
      ),
    ];
    return uniqueCategories;
  };

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await apiService.getAllDocuments();
        setDocuments(data.docs); // Ensure data structure matches API response
      } catch (err) {
        setError(err.message || "Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Derive categories dynamically from fetched documents
  const categories = extractCategories(documents);

  // Filter documents based on search and category
  const filteredDocs = documents.filter(
    (doc) =>
      (selectedCategory === "All" || doc.category === selectedCategory) &&
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="document-container">
      <h2 className="title">📜 Legal Document Retrieval</h2>

      {/* Search Bar */}
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

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Display Loading State */}
      {loading && <p className="loading">Loading documents... ⏳</p>}

      {/* Display Error State */}
      {error && <p className="error">⚠️ {error}</p>}

      {/* Document List */}
      <div className="document-grid">
        {!loading && !error && filteredDocs.length > 0
          ? filteredDocs.map((doc) => (
              <div key={doc.id} className="document-card">
                <h3>{doc.name}</h3>
                <p>📂 Category: {doc.category}</p>
                <div className="document-actions">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-document"
                  >
                    View Document →
                  </a>
                  <a href={doc.url} download className="download-document">
                    <FaFileDownload /> Download
                  </a>
                </div>
                <small>
                  Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                </small>
              </div>
            ))
          : !loading && <p className="no-results">No documents found 📌</p>}
      </div>
    </div>
  );
};

export default DocumentRetrievalPage;
