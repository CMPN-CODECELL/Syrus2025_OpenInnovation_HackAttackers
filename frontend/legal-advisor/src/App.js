// REACT //
import React from "react";

// MODULES //
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// COMPONENTS //
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

// OTHERS //
import HomePage from "./pages/HomePage";
import LegalCompanionPage from "./pages/LegalCompanionPage";
import DocumentRetrievalPage from "./pages/DocumentRetrievalPage";
import CaseTrackingPage from "./pages/CaseTrackingPage";
import EmergencyHelpPage from "./pages/EmergencyPageHelp";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/legal-companion" element={<LegalCompanionPage />} />
            <Route
              path="/document-retrieval"
              element={<DocumentRetrievalPage />}
            />
            <Route path="/case-tracking" element={<CaseTrackingPage />} />
            <Route path="/emergency-help" element={<EmergencyHelpPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
