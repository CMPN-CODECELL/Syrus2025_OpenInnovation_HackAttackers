import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OtpPage.css";

function OtpPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      navigate("/login");
      return; // Prevent further execution
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to the next field if a digit is entered
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    // Move back if deleting a digit
    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setError("Please enter all 4 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      // Save user_id and isRegistered status
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("isRegistered", data.isRegistered);

      // Redirect based on isRegistered status
      if (data.isRegistered) {
        navigate("/"); // Redirect to home if already registered
      } else {
        navigate("/register"); // Redirect to registration page
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      alert("New OTP has been sent to your email");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <h2>Enter OTP</h2>
        <p>Please enter the 4-digit code sent to {email}</p>

        {error && <div className="error-message">{error}</div>}

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
                disabled={loading}
              />
            ))}
          </div>

          <button type="submit" className="otp-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="otp-footer">
          <p>
            Didn't receive the OTP?{" "}
            <span
              onClick={handleResendOtp}
              style={{ color: "#346fe4", cursor: "pointer" }}
            >
              Resend OTP
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OtpPage;
