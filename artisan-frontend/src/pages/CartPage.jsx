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

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      return;
    }
    navigate("/checkout"); // Navigate to the checkout page
  };

  return (
    <div>
      <Header />
      <div className="cart-page">
        <h1 className="cart-page__title">Your Cart</h1>
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
                  <p className="cart-page__item-price">৳ {item.price}</p>
                  <p className="cart-page__item-quantity">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <button
                  className="cart-page__remove-button"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <button className="cart-page__checkout-button" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
