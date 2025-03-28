// REACT //
import React, { useState } from "react";

// STYLES //
import "./EmergencyPageHelp.css";

const EmergencyHelpPage = () => {
  const [location, setLocation] = useState(null);
  const emergencyContacts = {
    India: { police: "100", ambulance: "102", womenHelpline: "1091" },
    USA: { police: "911", ambulance: "911", womenHelpline: "800-799-7233" },
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation("India"), // Hardcoded for simplicity
      () => alert("Unable to fetch location")
    );
  };

  return (
    <div className="emergency-help-container">
      <h1>Emergency Help</h1>
      <button onClick={getUserLocation}>Allow Location</button>

      {location && (
        <div className="emergency-info">
          <h2>Emergency Contacts in {location}</h2>
          <p>👮 Police: {emergencyContacts[location].police}</p>
          <p>🚑 Ambulance: {emergencyContacts[location].ambulance}</p>
          <p>👩‍⚖️ Women Helpline: {emergencyContacts[location].womenHelpline}</p>
        </div>
      )}
    </div>
  );
};

export default EmergencyHelpPage;
