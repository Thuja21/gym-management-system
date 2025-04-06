import React, { useState } from "react";
import "./memberLogin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {FaLock, FaUser} from "react-icons/fa";
import img from "../../assets/images/loginIllustration.png";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null); // ✅ Defined useState for setUser
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
                localStorage.setItem("user", JSON.stringify(response.data)); // Store user data
                setUser(response.data); // Update React state
                // Redirect based on user type
                switch (userType) {
                    case "CUSTOMER":
                        navigate("/customerDashboard");
                        break;
                    case "MEMBER":
                        navigate("/home"); // Redirect to Home
                        break;
                    case "TRAINER":
                        navigate("/trainerDashboard");
                        break;
                    case "ADMIN":
                        navigate("/adminDashboard");
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
        <div className="login-container1">
            <div className="login-wrapper">

                {/* Right Section: Illustration */}
                <div className="info-box">
                    <img src={img} alt="Project Progress" className="info-img" />
                    {/*<h3>Check Your Project Progress</h3>*/}
                    {/*<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vitae est vel sapien.</p>*/}
                </div>

                {/* Left Section: Login */}
                <div className="login-box1">
                    <h2>Login</h2>
                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}
                    <form onSubmit={handleLogin}>
                        {/* Username */}
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label1">User Name</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaUser /></span>
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

                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label1">Password</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaLock /></span>
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

                        {/* Submit */}
                        <button
                            type="submit"
                            className="bg-[#FF4500] text-white px-4 py-2 w-full rounded-md text-lg cursor-pointer transition duration-300 hover:bg-orange-700 mt-7"
                        >
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
        </div>
);
};

export default Login;
