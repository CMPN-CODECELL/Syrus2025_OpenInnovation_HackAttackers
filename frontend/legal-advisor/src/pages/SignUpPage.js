import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    location: { lat: null, long: null },
  });
  const [email, setEmail] = useState(""); // Email from localStorage
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate("/login"); // Redirect to login if email is missing
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }

    try {
      const userId = localStorage.getItem("user_id"); // Retrieve user ID from login
      if (!userId) {
        throw new Error("User authentication failed. Please login again.");
      }

      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          name: formData.name,
          phone: formData.phone || null,
          address: formData.address || null,
          location: formData.location.lat ? formData.location : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      alert("Registration successful!");
      navigate("/"); // Redirect after successful registration
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <h2>Sign Up</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Display email as read-only */}
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} disabled />
            </div>

            <div className="form-group">
              <label>Phone (Optional)</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Address (Optional)</label>
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
