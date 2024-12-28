import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Added useNavigate
import "./styles/ProductPage.css";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";

// Import images locally
import telescope1 from "../assets/telescope1.jpg";
import telescope2 from "../assets/telescope2.jpg";
import telescope3 from "../assets/telescope3.jpg";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // State for quantity
  const navigate = useNavigate(); // Navigation hook

  const productId = searchParams.get("id"); // Get the product ID from the URL

  const imageMapping = {
    telescope1: telescope1,
    telescope2: telescope2,
    telescope3: telescope3,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://artisan-orion.onrender.com/api/products/${productId}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1)); // Prevent quantity below 1

  const handleButtonClick = (buttonType) => {
    const artisan = localStorage.getItem("artisan");
    if (!artisan) {
      navigate("/login"); // Redirect to login if artisan is not set
    } else {
      // Retrieve cart from local storage, or initialize it if empty
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if product is already in the cart
      const productIndex = cart.findIndex((item) => item.id === productId);

      if (productIndex > -1) {
        // Product already in cart, update the quantity
        cart[productIndex].quantity = quantity;
      } else {
        // Product not in cart, add it with quantity
        cart.push({
          id: productId,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity,
        });
      }

      // Save the updated cart back to local storage
      localStorage.setItem("cart", JSON.stringify(cart));

      // For now, you can handle the button logic here (e.g., for "Buy Now" or "Add to Cart")
      // This can be further enhanced later for redirecting to the cart or checkout page
      console.log("Cart updated:", cart);

      if (buttonType == "add-to-cart") {
        navigate("/");
      } else if (buttonType == "buy-now") {
        navigate("/cart");
      }
    }
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div>
      <Header />
      <div className="product-page">
        <div className="product-page__upper-section">
          <div className="product-page__left">
            <img
              src={imageMapping[product.image_url]}
              alt={product.name}
              className="product-page__image"
            />
          </div>
          <div className="product-page__right">
            <h1 className="product-page__name">{product.name}</h1>
            <p className="product-page__brand">Brand: {product.brand}</p>
            <p className="product-page__price">৳ {product.price}</p>
            <div className="product-page__quantity-wrapper">
              <p className="product-page__quantity-label">Quantity:</p>
              <div className="product-page__quantity-control">
                <button
                  onClick={decreaseQuantity}
                  className="product-page__quantity-button"
                >
                  -
                </button>
                <span className="product-page__quantity">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="product-page__quantity-button"
                >
                  +
                </button>
              </div>
            </div>
            <div className="product-page__action-buttons">
              <button
                className="product-page__buy-now-button"
                onClick={() => handleButtonClick("buy-now")} // Add onClick for "Buy Now"
              >
                Buy Now
              </button>
              <button
                className="product-page__add-to-cart-button"
                onClick={() => handleButtonClick("add-to-cart")} // Add onClick for "Add to Cart"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div className="product-page__lower-section">
          <h2>Product Specification</h2>
          <p className="product-page__description">{product.description}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
