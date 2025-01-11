import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./styles/ProductPage.css";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Import images locally
import telescope1 from "../assets/telescope1.jpg";
import telescope2 from "../assets/telescope2.jpg";
import telescope3 from "../assets/telescope3.jpg";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const productId = searchParams.get("id");

  const imageMapping = {
    telescope1: telescope1,
    telescope2: telescope2,
    telescope3: telescope3,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://artisan.cam-sust.org/api/products/${productId}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
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
      navigate("/login"); // Redirect to login if user not logged in
    } else {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const productIndex = cart.findIndex((item) => item.id === productId);

      if (productIndex > -1) {
        cart[productIndex].quantity = quantity;
      } else {
        cart.push({
          id: productId,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      if (buttonType === "add-to-cart") {
        navigate("/");
      } else if (buttonType === "buy-now") {
        navigate("/cart");
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="product-page">
          <div className="product-page__upper-section">
            <div className="product-page__left product_placeholder">
              <div className="product_placeholder-image"></div>
            </div>
            <div className="product-page__right">
              <h1 className="product_placeholder-text">
                Loading Product Name...
              </h1>
              <p className="product_placeholder-text">Brand: ---</p>
              <p className="product_placeholder-text">৳ ---</p>
              <div className="product-page__quantity-wrapper">
                <p className="product_placeholder-text">Quantity: </p>
                <div className="product_placeholder-quantity-control"></div>
              </div>
              <div className="product-page__action-buttons">
                <button className="product_placeholder-button" disabled>
                  Buy Now
                </button>
                <button className="product_placeholder-button" disabled>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <div className="product-page__lower-section">
            <h2>Product Specification...</h2>
            <p className="product_placeholder-text">Loading description...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
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
                onClick={() => handleButtonClick("buy-now")}
              >
                Buy Now
              </button>
              <button
                className="product-page__add-to-cart-button"
                onClick={() => handleButtonClick("add-to-cart")}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div className="product-page__lower-section">
          <h2>Product Specification</h2>
          <ReactMarkdown
            className="product-page__description"
            children={product.description}
            remarkPlugins={[remarkGfm]} // Rendering markdown code
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
