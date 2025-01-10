import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "./styles/OrderPage.css";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const OrderPage = () => {
  const [searchParams] = useSearchParams();
  const order_id = searchParams.get("id");
  const username = localStorage.getItem("artisan"); // Get username from localStorage
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.post(
          "https://artisan.cam-sust.org/api/order/check-status",
          {
            order_id,
            username,
          }
        );
        setStatuses(response.data.status || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch order status."
        );
      }
    };

    fetchOrderStatus();
  }, [order_id, username]);

  return (
    <div>
      <Header />
      <div className="order-page">
        <h1 className="order-page-title">Order Tracking</h1>
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="timeline">
            {statuses.map((status, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3 className="timeline-time">
                    {new Date(status.date).toLocaleString()}
                  </h3>
                  <p className="timeline-message">{status.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderPage;
