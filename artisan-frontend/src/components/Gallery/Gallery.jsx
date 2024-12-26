import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "./Gallery.css";

// Import images locally
import telescope1 from "../../assets/telescope1.jpg";
import telescope2 from "../../assets/telescope2.jpg";
import telescope3 from "../../assets/telescope3.jpg";

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  const imageMapping = {
    telescope1: telescope1,
    telescope2: telescope2,
    telescope3: telescope3,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://artisan-orion.onrender.com/api/products"
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Navigate to ProductPage with product ID in the query
  const handleLearnMore = (id) => {
    navigate(`/products?id=${id}`);
  };

  return (
    <div className="gallery">
      {products.map((product) => (
        <div key={product._id} className="card">
          <img
            src={imageMapping[product.image_url]}
            alt={product.name}
            className="product-image"
          />
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">৳ {product.price}</p>
          <button
            className="learn-more"
            onClick={() => handleLearnMore(product._id)}
          >
            Learn More
          </button>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
