import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // For accessing query params
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
              <button className="product-page__buy-now-button">Buy Now</button>
              <button className="product-page__add-to-cart-button">
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
