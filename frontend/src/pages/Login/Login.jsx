import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {FaLock, FaUser} from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For error messages
  const navigate = useNavigate();

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setErrorMessage("Username and Password are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/login",
        { username, password }
      );

      // Check if login is successful
      if (response.status === 200) {
        const userType = response.data.user_type; // Assuming 'userType' is sent from the backend
        localStorage.setItem("userType", userType); // Store user type in localStorage
        // Redirect based on user type
        switch (userType) {
          case "CUSTOMER":
            navigate("/customerDashboard");
            break;
          case "MEMBER":
            navigate("/memberDashboard");
            break;
          case "TRAINER":
            navigate("/TrainerDashboard");
            break;
          case "ADMIN":
            navigate("/admin-dashboard");
            break;
          default:
            setErrorMessage("Unknown user type.");
            break;
        }
      } else {
        setErrorMessage("Login failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred while logging in.");
    }
  };

  // Redirect to signup page
  const handleSignupRedirect = () => {
    navigate("/signup"); // Replace with the actual route for signup
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}{" "}
        {/* Display error message */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              User Name
            </label>
            <div className="input-group">
                            <span className="input-group-text">
                                <FaUser />
                            </span>
              <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label" >
              Password
            </label>
            <div className="input-group">
                            <span className="input-group-text">
                                <FaLock />
                            </span>
              <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
              />
            </div>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="signup-text">
          Don’t have an account?{" "}
          <a href="#" onClick={handleSignupRedirect}>
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
