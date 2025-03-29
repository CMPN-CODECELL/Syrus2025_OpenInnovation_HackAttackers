import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/profilee.png";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // Check if user is logged in by looking for user_id in localStorage
    const userId = localStorage.getItem("user_id");
    setIsLoggedIn(!!userId);
    
    // Get profile image from localStorage if available
    if (userId) {
      try {
        const savedImage = localStorage.getItem(`profile_image_${userId}`);
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.error("Error loading profile image from localStorage:", error);
      }
    }
    
    // Close mobile menu on resize to desktop
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    // Refresh the page or redirect
    window.location.reload();
  };

  // Close dropdown when clicking anywhere else
  useEffect(() => {
    const closeDropdown = () => setShowDropdown(false);
    if (showDropdown) {
      document.addEventListener('click', closeDropdown);
      return () => document.removeEventListener('click', closeDropdown);
    }
  }, [showDropdown]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="KanoonSaathi Logo" className="logo-img" />
          </Link>
        </div>
        
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/legal-companion" onClick={() => setMobileMenuOpen(false)}>Legal Companion</Link></li>
            <li><Link to="/document-retrieval" onClick={() => setMobileMenuOpen(false)}>Legal Documents</Link></li>
            <li><Link to="/case-tracking" onClick={() => setMobileMenuOpen(false)}>Case Tracking</Link></li>
            <li><Link to="/emergency-help" onClick={() => setMobileMenuOpen(false)} className="emergency-btn">Emergency Help</Link></li>
          </ul>
          
          <div className="navbar-auth">
            {isLoggedIn ? (
              <div className="profile-container">
                <div
                  className="avatar-container"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                  }}
                >
                  <img
                    src={profileImage || defaultAvatar}
                    alt="Profile"
                    className="avatar-img"
                  />
                </div>
                
                {showDropdown && (
                  <div className="profile-dropdown">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                    <Link to="/my-complaints" onClick={() => setMobileMenuOpen(false)}>My Complaints</Link>
                    <div onClick={handleLogout} className="logout-option">Logout</div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;