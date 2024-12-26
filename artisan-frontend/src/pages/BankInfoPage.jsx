import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/BankInfoPage.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const BankInfoPage = () => {
  const [bankAccount, setBankAccount] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const username = localStorage.getItem("artisan");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://artisan-orion.onrender.com/api/update-bank-info", // Replace with your backend endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            bank_account: bankAccount,
            secret_key: secretKey,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/profile"); // Navigate to profile page after successful update
      } else {
        setErrorMessage(data.message || "Failed to update bank information.");
      }
    } catch (error) {
      console.error("Error updating bank information:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div className="bank-info-page">
        <h2 className="form-title">Update Bank Information</h2>
        <form className="bank-info-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Bank Account Number"
            className="bank-form-input"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Secret Key"
            className="bank-form-input"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            required
          />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default BankInfoPage;
