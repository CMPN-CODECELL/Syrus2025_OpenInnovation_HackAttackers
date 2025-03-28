// src/components/Layout/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">KanoonSaathi</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/legal-companion">Legal Companion</Link></li>
        <li><Link to="/document-retrieval">Legal Documents</Link></li>
        <li><Link to="/case-tracking">Case Tracking</Link></li>
        <li><Link to="/emergency-help" className="emergency-btn">Emergency Help</Link></li>
        <li><Link to="/login">Login</Link></li>   
      </ul>
    </nav>
  );
}

export default Navbar;
