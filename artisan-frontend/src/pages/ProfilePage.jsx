import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ProfilePage.css";
import { FaUserCircle } from "react-icons/fa";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [orderIds, setOrderIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("artisan");

  const handleLogout = () => {
    localStorage.removeItem("artisan");
    localStorage.removeItem("cart");
    navigate("/");
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/user/order-history",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order history");
        }

        const data = await response.json(); // Response contains an array of order IDs
        if (data.orders) {
          setOrderIds(data.orders);
        }
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order history:", error);
        setError("Failed to load order history");
        setLoading(false);
      }
    };

    if (username) {
      fetchOrderHistory();
    } else {
      setError("User is not logged in");
      setLoading(false);
    }
  }, [username]);

  const handleTrackOrder = (orderId) => {
    navigate(`/order?id=${orderId}`);
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
        <div className="order-info-list">
          <h3 className="order-history-title">Order History</h3>
          {loading && <p>Loading...</p>}
          {!loading && !error && orderIds.length === 0 && (
            <p>No orders found so far!</p>
          )}

          {!loading && !error && orderIds.length > 0 && (
            <div className="order-list">
              {orderIds.map((orderId) => (
                <div key={orderId} className="order-item">
                  <div className="order-item-id">Order ID: {orderId}</div>
                  <button
                    className="track-button"
                    onClick={() => handleTrackOrder(orderId)}
                  >
                    Track
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
