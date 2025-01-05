import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/CartPage.css";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";

// Import images locally
import telescope1 from "../assets/telescope1.jpg";
import telescope2 from "../assets/telescope2.jpg";
import telescope3 from "../assets/telescope3.jpg";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(""); // State for displaying error message
  const navigate = useNavigate();

  const imageMapping = {
    telescope1: telescope1,
    telescope2: telescope2,
    telescope3: telescope3,
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckout = async () => {
    const phoneInput = document.querySelector(".cart-page__input").value.trim();
    const addressInput = document
      .querySelector(".cart-page__textarea")
      .value.trim();

    if (!phoneInput || !addressInput) {
      setError(
        !phoneInput && !addressInput
          ? "Phone number and address are required."
          : !phoneInput
          ? "Phone number is required."
          : "Address is required."
      );
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty. Add items before checking out.");
      return;
    }

    setError("");

    // Prepare order data
    const orderData = {
      username: localStorage.getItem("artisan"), // Replace with actual username
      phone: phoneInput,
      address: addressInput,
      ordered_products: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price, // Ensure price is sent as well for total calculation in backend
      })),
    };

    console.log(orderData);

    // Call API to create order
    try {
      const response = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      const id = data.order_id;
      if (response.ok) {
        localStorage.removeItem("cart");
        navigate(`/checkout?id=${id}`);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("Failed to place the order.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div>
      <Header />
      <div className="cart-page">
        <h1 className="cart-page__title">Your Cart</h1>
        <div className="cart-page__content">
          {/* Cart Items Section */}
          <div className="cart-page__items-section">
            {cartItems.length === 0 ? (
              <p className="cart-page__empty">Your cart is empty!</p>
            ) : (
              <div className="cart-page__items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-page__item">
                    <img
                      src={imageMapping[item.image_url]}
                      alt={item.name}
                      className="cart-page__item-image"
                    />
                    <div className="cart-page__item-details">
                      <h2 className="cart-page__item-name">{item.name}</h2>

                      <div className="cart-page__item-price">
                        ৳ {item.price}
                      </div>
                      <div className="cart-page__item-quantity">
                        Quantity: {item.quantity}
                      </div>

                      <div className="cart-page__item-subtotal">
                        Subtotal: ৳ {item.price * item.quantity}
                      </div>
                    </div>
                    <button
                      className="cart-page__remove-button"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="cart-page__summary-section">
            <h2 className="cart-page__summary-title">Order Summary</h2>
            <div className="cart-page__summary-details">
              <label className="cart-page__label">Phone Number:</label>
              <input
                type="text"
                className="cart-page__input"
                placeholder="Enter phone number"
              />

              <label className="cart-page__label">Address:</label>
              <textarea
                className="cart-page__textarea"
                placeholder="Enter your address"
              ></textarea>

              <h3 className="cart-page__total">
                Total Amount: ৳ {calculateTotal()}
              </h3>
            </div>

            {/* Display error message */}
            {error && <p className="cart-page__error">{error}</p>}

            <button
              className="cart-page__checkout-button"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
