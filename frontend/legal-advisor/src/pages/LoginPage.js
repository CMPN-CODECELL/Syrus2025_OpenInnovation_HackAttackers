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





import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const handleNavigateToRegister = () => {
    navigate("/register");   // Redirects to signup page
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/otp");   // Redirects to OTP page on login
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>

            {/* Email Field */}
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                required 
              />
            </div>

            <button type="submit" className="login-btn">Login</button>

            <div className="login-footer">
              <p>Don't have an account? 
                <span 
                  onClick={handleNavigateToRegister} 
                  style={{ color: '#346fe4', cursor: 'pointer' }}
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
