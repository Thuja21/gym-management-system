import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Username and Password are required.");
      return;
    }

    try {
      const response = await axios.post(
          "http://localhost:8800/api/auth/login",
          { username, password },
          { withCredentials: true }
      );

      if (response.status === 200) {
        const userType = response.data.user_type;
        localStorage.setItem("userType", userType);
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        switch (userType) {
          case "CUSTOMER":
            navigate("/customerDashboard");
            break;
          case "MEMBER":
            navigate("/home");
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
      // Improved error message handling
      setErrorMessage(
          error.response?.data?.message || "An error occurred while logging in."
      );
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  const handleForgotpassword = (e) => {
    e.preventDefault();
    navigate("/forgotpassword");
  };

  return (
      <div
          className="min-h-screen relative bg-slate-900 flex items-center justify-center overflow-hidden"
          style={{ width: "100vw" }}
      >
        {/* Geometric patterns */}
        <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")`,
              backgroundRepeat: 'repeat'
            }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-blue-500/20" />

        {/* Diagonal stripes */}
        <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.05) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.05) 75%,
            transparent 75%,
            transparent
          )`,
              backgroundSize: '100px 100px',
            }}
        />

        {/* Login Form */}
        <div className="relative w-full max-w-md mx-4 p-8 rounded-3xl bg-white/20 backdrop-blur-sm border border-[#FF4500]/20">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#FF4500] p-3 rounded-full">
              <Dumbbell size={32} className="text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">JK FITNESS</h2>
          <p className="text-gray-300 text-center mb-8">Train Hard, Live Better</p>

          {/* Error Message Display */}
          {errorMessage && (
              <div className="text-red-500 text-sm text-center mb-4">
                {errorMessage}
              </div>
          )}

          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#FF4500]/30 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] transition duration-200"
                />
              </div>

              <div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#FF4500]/30 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] transition duration-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-gray-300">
              <a
                  href="#"
                  onClick={handleForgotpassword}
                  className="text-sm text-[#FF4500] hover:text-[#FF4500]/80 transition duration-200"
              >
                Forgot Password?
              </a>
            </div>

            <button
                onClick={handleLogin}
                className="w-full py-3 px-4 rounded-xl bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4500]/50"
            >
              Login
            </button>

            <div className="text-center text-gray-300">
              <p className="text-sm">
                Don't have an account?{' '}
                <a
                    href="#"
                    onClick={handleSignupRedirect}
                    className="text-[#FF4500] hover:text-[#FF4500]/80 transition duration-200"
                >
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
  );
}

export default App;