// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./LoginPage.css";

// function LoginPage() {
//   const navigate = useNavigate();

//   const handleNavigateToRegister = () => {
//     navigate("/register");   // Redirects to signup page
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <div className="login-card">
//           <h2>Login</h2>
//           <form>

//             {/* Email Field */}
//             <div className="form-group">
//               <label>Email</label>
//               <input 
//                 type="email" 
//                 placeholder="Enter your email" 
//                 required 
//               />
//             </div>

//             <button type="submit" className="login-btn">Login</button>

//             <div className="login-footer">
//               <p>Don't have an account? 
//                 <span 
//                   onClick={handleNavigateToRegister} 
//                   style={{ color: '#346fe4', cursor: 'pointer' }}
//                 >
//                   Register here
//                 </span>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      // Store user_id in localStorage for use in OTP verification
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('email', email);
      
      // Navigate to OTP verification page
      navigate("/otp");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="login-btn" 
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Login"}
            </button>

            <div className="login-footer">
              <p>
                Don't have an account?{" "}
                <span
                  onClick={handleNavigateToRegister}
                  style={{ color: "#346fe4", cursor: "pointer" }}
                >
                  Register here
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
