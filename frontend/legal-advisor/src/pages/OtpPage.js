import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OtpPage.css";

function OtpPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;  // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to the next field if a digit is entered
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length === 4) {
      alert(`OTP Submitted: ${otpValue}`);
      navigate("/");  // Navigate to home or success page
    } else {
      alert("Please enter all 4 digits.");
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <h2>Enter OTP</h2>
        <form onSubmit={handleSubmit}>

          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            ))}
          </div>

          <button type="submit" className="otp-btn">Verify OTP</button>
        </form>
        
        <div className="otp-footer">
          <p>Didn't receive the OTP? </p>
        </div>
      </div>
    </div>
  );
}

export default OtpPage;
