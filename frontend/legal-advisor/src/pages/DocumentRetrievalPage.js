import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./DocumentRetrievalPage.css";

const allDocuments = [
  { id: 1, title: "Women's Rights Act 2001", category: "Women", link: "#" },
  { id: 2, title: "Child Protection Act 2010", category: "Children", link: "#" },
  { id: 3, title: "Domestic Violence Act 2005", category: "Women", link: "#" },
  { id: 4, title: "Cyber Crime Laws in India", category: "Cyber", link: "#" },
  { id: 5, title: "Fundamental Rights of Citizens", category: "General", link: "#" },
  { id: 6, title: "RTI Act 2005", category: "General", link: "#" },
  { id: 7, title: "POSH Act 2013", category: "Workplace", link: "#" },
];

const categories = ["All", "Women", "Children", "Cyber", "General", "Workplace"];

const DocumentRetrievalPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredDocs = allDocuments.filter((doc) =>
    (selectedCategory === "All" || doc.category === selectedCategory) &&
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="document-grid">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div key={doc.id} className="document-card">
              <h3>{doc.title}</h3>
              <p>📂 Category: {doc.category}</p>
              <a href={doc.link} target="_blank" rel="noopener noreferrer">
                View Document →
              </a>
            </div>
          ))
        ) : (
          <p className="no-results">No documents found 📌</p>
        )}
      </div>
    </div>
  );
};

export default DocumentRetrievalPage;