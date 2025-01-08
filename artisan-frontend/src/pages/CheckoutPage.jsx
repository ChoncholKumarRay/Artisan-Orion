import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./styles/CheckoutPage.css";
import blueIcon from "../assets/blue_check.png";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const username = localStorage.getItem("artisan"); // Get username from localStorage
  const [bankAccount, setBankAccount] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionId, setTransactionId] = useState(null); // Store transaction ID
  const [bankMessage, setBankMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [senderPin, setSenderPin] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bankAccount || !secretKey) {
      setErrorMessage("Please provide both bank account and secret key.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/order/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          username,
          bank_account: bankAccount,
          secret_key: secretKey,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTransactionId(data.transaction_id);
        setBankMessage(data.message);
      } else {
        setErrorMessage(data.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!senderPin) {
      setErrorMessage("Please provide your bank pin");
      return;
    }
    setErrorMessage("");

    try {
      // First, verify the bank pin and complete the payment process
      const response = await fetch(
        "http://localhost:5001/api/user/response-pay-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction_id: transactionId,
            sender_account: bankAccount,
            sender_pin: senderPin,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTransactionId(data.transaction_id);
        setBankMessage(data.message);
        const acknowledgeResponse = await fetch(
          "http://localhost:5000/api/order/payment-acknowledge",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId,
              transactionId,
            }),
          }
        );

        if (acknowledgeResponse.ok) {
          navigate(`/order?id=${orderId}`);
        } else {
          const ackData = await acknowledgeResponse.json();
          setErrorMessage(
            ackData.message ||
              "Payment acknowledgment failed. Please try again."
          );
        }
      } else {
        setErrorMessage(
          data.message || "Bank Account verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during payment or acknowledgment:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
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
        {!transactionId ? (
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
              <button
                type="submit"
                className="submit-button"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        ) : (
          <div className="confirm-payment-section">
            {isPopupOpen && (
              <div className="popup-overlay">
                <div className="popup">
                  <span
                    className="close-popup"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    &times;
                  </span>
                  <p>{bankMessage}</p>
                </div>
              </div>
            )}
            <h2 className="confirm-payment-title">Give Bank Pin</h2>
            <form className="confirm-payment-form">
              <input
                type="password"
                placeholder="Bank Pin"
                className="confirm-payment-input"
                value={senderPin}
                onChange={(e) => setSenderPin(e.target.value)}
                required
              />
              <button
                type="button"
                className="submit-button"
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
