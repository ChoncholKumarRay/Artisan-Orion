import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/RegisterPage.css"; // You can reuse the same CSS
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://artisan.cam-sust.org/api/login", // Replace with your backend login API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("artisan", username);
        console.log(localStorage.getItem("artisan"));

        navigate(data.redirectTo);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div className="login-page">
        <form className="register-form" onSubmit={handleLogin}>
          <h2 className="form-title">Log In</h2>
          <div className="form-username">
            <input
              type="text"
              placeholder="Username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="password-field">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit" className="register-button">
            Log In
          </button>
          <div className="register-link">
            <span>Don't have an account? </span>
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/register")} // Navigate to register page
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
