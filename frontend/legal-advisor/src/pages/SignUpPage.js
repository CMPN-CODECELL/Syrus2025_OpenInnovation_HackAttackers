import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUpPage.css";

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Name is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email.");
      return;
    }

    alert(`Signed up successfully with: 
    Name: ${formData.name}
    Email: ${formData.email}
    Address: ${formData.address || "Not provided"}`);
  };

  return (
    <div className="signup-page">
      {/* Signup Form */}
      <div className="signup-container">
        <div className="signup-card">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            
            {/* Name Field */}
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

            {/* Email Field */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address Field (Optional) */}
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

            <button type="submit" className="signup-btn">Sign Up</button>

            <div className="signup-footer">
              <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
