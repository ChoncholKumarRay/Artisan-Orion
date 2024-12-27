import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ProfilePage.css"; // Custom CSS for ProfilePage
import { FaUserCircle } from "react-icons/fa";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const ProfilePage = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem("artisan");

  const handleLogout = () => {
    localStorage.removeItem("artisan");
    localStorage.removeItem("cart");
    navigate("/");
  };

  return (
    <div>
      <Header />
      <div className="profile-page">
        <h2 className="profile-title">Profile Info</h2>
        <div className="profile-card">
          <FaUserCircle className="profile-icon" />
          <p className="profile-username">Username: {username}</p>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
