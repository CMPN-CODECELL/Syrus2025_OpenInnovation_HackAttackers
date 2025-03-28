// REACT //
import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaFirstAid,
  FaVenusMars,
} from "react-icons/fa";

// STYLES //
import "./EmergencyPageHelp.css";

const EMERGENCY_CONTACTS = {
  India: {
    police: {
      number: "100",
      description: "National Police Helpline",
      icon: <FaShieldAlt />,
    },
    ambulance: {
      number: "102",
      description: "Emergency Medical Services",
      icon: <FaFirstAid />,
    },
    womenHelpline: {
      number: "1091",
      description: "National Women Helpline",
      icon: <FaVenusMars />,
    },
    childHelpline: {
      number: "1098",
      description: "Child Protection Helpline",
      icon: <FaShieldAlt />,
    },
    domesticViolence: {
      number: "181",
      description: "State Women Helpline",
      icon: <FaVenusMars />,
    },
  },
  USA: {
    police: {
      number: "911",
      description: "Emergency Services",
      icon: <FaShieldAlt />,
    },
    ambulance: {
      number: "911",
      description: "Emergency Medical Services",
      icon: <FaFirstAid />,
    },
    womenHelpline: {
      number: "800-799-7233",
      description: "National Domestic Violence Hotline",
      icon: <FaVenusMars />,
    },
  },
};

const SAFETY_TIPS = [
  "Stay calm and assess the situation.",
  "Call emergency services immediately.",
  "Try to move to a safe location if possible.",
  "Provide clear and concise information when calling.",
  "If safe, document any evidence.",
];

const EmergencyHelpPage = () => {
  const [location, setLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            console.log(latitude);
            console.log(longitude);
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            console.log(data);
            if (data.address && data.address.country) {
              setLocation(data.address.country);
              setPermissionStatus("granted");
            } else {
              alert("Could not detect location.");
            }
          } catch (error) {
            alert("Error fetching location details.");
          }
        },
        (error) => {
          setPermissionStatus("denied");
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert(
                "Location permission denied. Please enable it in settings."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("Location request timed out.");
              break;
            default:
              alert("An unknown error occurred.");
          }
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const makeEmergencyCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="emergency-help-container">
      <h1>Emergency Assistance</h1>

      <div className="location-section">
        <button
          onClick={getUserLocation}
          className={`location-btn ${
            permissionStatus === "granted" ? "active" : ""
          }`}
          aria-label="Get location access"
        >
          <FaMapMarkerAlt />
          {permissionStatus === "granted"
            ? `Location: ${location}`
            : "Allow Location Access"}
        </button>
      </div>

      {location && (
        <div className="emergency-info">
          <h2>Emergency Contacts in {location}</h2>
          <div className="contact-grid">
            {Object.entries(EMERGENCY_CONTACTS[location] || {}).map(
              ([key, contact]) => (
                <div key={key} className="contact-card">
                  <div className="contact-icon">{contact.icon}</div>
                  <div className="contact-details">
                    <h3>{contact.description}</h3>
                    <p>{contact.number}</p>
                  </div>
                  <button
                    className="call-btn"
                    onClick={() => makeEmergencyCall(contact.number)}
                    aria-label={`Call ${contact.description}`}
                  >
                    <FaPhoneAlt /> Call
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div className="safety-tips">
        <h2>Immediate Safety Tips</h2>
        <ul>
          {SAFETY_TIPS.map((tip, index) => (
            <li key={index}>
              <span className="tip-number">{index + 1}</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="disclaimer">
        <h3>Important Disclaimer</h3>
        <p>
          In case of immediate danger, always call local emergency services
          first. This app provides guidance but is not a substitute for
          professional help.
        </p>
      </div>
    </div>
  );
};

export default EmergencyHelpPage;