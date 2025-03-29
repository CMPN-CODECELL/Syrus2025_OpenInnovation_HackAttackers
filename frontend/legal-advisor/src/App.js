// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// COMPONENTS
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

// PAGES
import HomePage from "./pages/HomePage";
import LegalCompanionPage from "./pages/LegalCompanionPage";
import DocumentRetrievalPage from "./pages/DocumentRetrievalPage";
import CaseTrackingPage from "./pages/CaseTrackingPage";
import EmergencyHelpPage from "./pages/EmergencyPageHelp";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";  // Import the Signup page
import OtpPage from "./pages/OtpPage";
import DocumentSummariserPage from "./pages/DocumentSummariserPage";
import DocumentRetrievalSummaryPage from "./pages/DocumentRetrievalSummaryPage";
import Profile from "./pages/ProfilePage";


function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/legal-companion" element={<LegalCompanionPage />} />
            <Route path="/document-retrieval" element={<DocumentRetrievalPage />} />
            <Route path="/case-tracking" element={<CaseTrackingPage />} />
            <Route path="/emergency-help" element={<EmergencyHelpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />  {}
            <Route path="/otp" element={<OtpPage />} />  {}
            <Route path="/document-summariser" element={<DocumentSummariserPage />} />
            <Route path="/document-summary/:id" element={<DocumentRetrievalSummaryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
