import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/BankInfoPage.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const BankInfoPage = () => {
  const [bankAccount, setBankAccount] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const username = localStorage.getItem("artisan");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsProcessing(true);

    try {
      const response = await fetch(
        "https://artisan.cam-sust.org/api/user/update-bank-info",
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
        navigate("/"); // Navigate to HomePage
      } else {
        setErrorMessage(data.message || "Failed to update bank information.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error updating bank information:", error);
      setErrorMessage("An error occurred. Please try again.");
      setIsProcessing(false);
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

          <button
            type="submit"
            className={`submit-button ${isProcessing ? "disabled-button" : ""}`}
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? <span className="loading-icon"></span> : "Submit"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default BankInfoPage;
