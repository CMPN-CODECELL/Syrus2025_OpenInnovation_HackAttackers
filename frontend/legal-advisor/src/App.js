import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import HomePage from './pages/HomePage';
import LegalCompanionPage from './pages/LegalCompanionPage';
import DocumentRetrievalPage from './pages/DocumentRetrievalPage';
import CaseTrackingPage from './pages/CaseTrackingPage';
import EmergencyPageHelp from './pages/EmergencyPageHelp';
import Footer from './components/Layout/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/legal-companion" element={<LegalCompanionPage />} />
          <Route path="/document-retrieval" element={<DocumentRetrievalPage />} />
          <Route path="/case-tracking" element={<CaseTrackingPage />} />
          <Route path="/emergency-help" element={<EmergencyPageHelp />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;