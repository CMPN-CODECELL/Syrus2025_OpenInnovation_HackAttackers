// // src/pages/HomePage.js
// import React from "react";
// import { Link } from "react-router-dom";
// import "./HomePage.css";

// function HomePage() {
//   return (
//     <div className="homepage">
//       {/* Hero Section */}
//       <section className="hero">
//         <div className="hero-content">
//           <h1>Empowering Women & Children with Legal Support</h1>
//           <p>Your trusted companion for legal guidance, case tracking, and emergency help.</p>
//           <Link to="/legal-companion" className="cta-btn">Get Legal Help</Link>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section className="services">
//         <h2>Our Services</h2>
//         <div className="service-cards">
//           <div className="service-card">
//             <h3>Legal Companion</h3>
//             <p>AI-powered legal advice tailored to your needs.</p>
//             <Link to="/legal-companion" className="service-btn">Learn More</Link>
//           </div>

//           <div className="service-card">
//             <h3>Document Retrieval</h3>
//             <p>Access and download essential legal documents.</p>
//             <Link to="/document-retrieval" className="service-btn">View Documents</Link>
//           </div>

//           <div className="service-card">
//             <h3>Case Tracking</h3>
//             <p>Monitor legal case progress in real-time.</p>
//             <Link to="/case-tracking" className="service-btn">Track Case</Link>
//           </div>

//           <div className="service-card emergency">
//             <h3>Emergency Help</h3>
//             <p>Get immediate assistance in crisis situations.</p>
//             <Link to="/emergency-help" className="service-btn">Get Help</Link>
//           </div>
//         </div>
//       </section>

//       {/* Call-To-Action Section */}
//       <section className="cta">
//         <h2>Need Legal Help?</h2>
//         <p>We're here to assist you with expert legal guidance and support.</p>
//         <Link to="/legal-companion" className="cta-btn">Start Now</Link>
//       </section>
//     </div>
//   );
// }

// export default HomePage;






import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Empowering Women & Children with Legal Support</h1>
          <p>Your trusted companion for legal guidance, case tracking, and emergency help.</p>
          <Link to="/legal-companion" className="cta-btn">Get Legal Help</Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="service-card">
            <h3>Legal Companion</h3>
            <p>AI-powered legal advice tailored to your needs.</p>
            <button className="service-btn" onClick={handleLearnMoreClick}>Learn More</button>
          </div>

          <div className="service-card">
            <h3>Document Retrieval</h3>
            <p>Access and download essential legal documents.</p>
            <Link to="/document-retrieval" className="service-btn">View Documents</Link>
          </div>

          <div className="service-card">
            <h3>Case Tracking</h3>
            <p>Monitor legal case progress in real-time.</p>
            <Link to="/case-tracking" className="service-btn">Track Case</Link>
          </div>

          <div className="service-card emergency">
            <h3>Emergency Help</h3>
            <p>Get immediate assistance in crisis situations.</p>
            <Link to="/emergency-help" className="service-btn">Get Help</Link>
          </div>
        </div>
      </section>

      {/* Call-To-Action Section */}
      <section className="cta">
        <h2>Need Legal Help?</h2>
        <p>We're here to assist you with expert legal guidance and support.</p>
        <Link to="/legal-companion" className="cta-btn">Start Now</Link>
      </section>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Select an Option</h3>
            <p>Choose how you want to proceed with the Legal Companion.</p>
            <button className="popup-btn" onClick={() => navigate("/legal-companion")}>
              Chat with Legal Advisor
            </button>
            <button className="popup-btn" onClick={() => navigate("/document-summariser")}>
              Upload Document & Get Summary
            </button>
            <button className="popup-close" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
