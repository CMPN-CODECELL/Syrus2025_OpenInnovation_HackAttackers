import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LegalCompanionPage from "./pages/LegalCompanionPage";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import "./index.css";
import DocumentRetrievalPage from "./pages/DocumentRetrievalPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/legal-companion" element={<LegalCompanionPage />} />
        <Route path="/document-retrieval" element={<DocumentRetrievalPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;