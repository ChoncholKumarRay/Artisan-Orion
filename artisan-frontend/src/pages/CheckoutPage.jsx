import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles/CheckoutPage.css";

const CheckoutPage = () => {
  const { order_id } = useParams(); // Access the order ID from the URL
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Fetch order details using the order_id from the backend (e.g., via an API)
    // This is just an example; you'll need to replace it with your actual API call
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${order_id}`);
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (order_id) {
      fetchOrderDetails();
    }
  }, [order_id]);

  return (
    <div className="checkout-container">
      <div className="icon">
        <img src="icon.png" alt="Order Icon" />
      </div>
      <div className="order-status">
        <h2>
          Your order is placed successfully. Please make payment to get the
          product.
        </h2>
      </div>
      <div className="form-container">
        <h3>Bank Details</h3>
        <form>
          <label htmlFor="bankAccount">Bank Account</label>
          <input type="text" id="bankAccount" name="bankAccount" required />

          <label htmlFor="secretKey">Secret Key</label>
          <input type="password" id="secretKey" name="secretKey" required />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
