import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./styles/CheckoutPage.css";
import blueIcon from "../assets/blue_check.png";

const Checkout = () => {
  const [bankAccount, setBankAccount] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const orderId = searchParams.get("id");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate bank account and secret key (simple example)
    if (!bankAccount || !secretKey) {
      setErrorMessage("Please provide both bank account and secret key.");
      return;
    }

    // Handle form submission (e.g., send data to the backend)
    console.log("Form submitted:", { bankAccount, secretKey });
  };

  return (
    <div>
      <Header />
      <div className="checkout-page">
        <img src={blueIcon} alt="" className="blue_check" />
        <div className="order-status">
          <h2>
            Your order is placed successfully. Please make payment to get the
            product.
          </h2>
        </div>
        <div className="verify-info-section">
          <h2 className="verify-form-title">Bank Details</h2>
          <form className="verify-info-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Bank Account Number"
              className="verify-form-input"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Secret Key"
              className="verify-form-input"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
