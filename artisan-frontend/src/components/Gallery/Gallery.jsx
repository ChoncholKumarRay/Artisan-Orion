import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";

// Import images locally
import telescope1 from "../../assets/telescope1.jpg";
import telescope2 from "../../assets/telescope2.jpg";
import telescope3 from "../../assets/telescope3.jpg";

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const imageMapping = {
    telescope1: telescope1,
    telescope2: telescope2,
    telescope3: telescope3,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://artisan.cam-sust.org/api/products/"
        );
        const data = await response.json();
        setProducts(data);
        setLoading(false); // Set loading to false once products are fetched
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchProducts();
  }, []);

  // Navigate to ProductPage with product ID in the query
  const handleLearnMore = (id) => {
    navigate(`/products?id=${id}`);
  };

  // Show placeholder cards if loading, else show actual products
  return (
    <div className="gallery">
      {loading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="card">
              <div className="placeholder-image"></div>
              <h3 className="product-name">Loading...</h3>
              <p className="product-price">৳ ---</p>
              <button className="learn-more" disabled>
                Loading...
              </button>
            </div>
          ))
        : products.map((product) => (
            <div
              key={product._id}
              className="card"
              onClick={() => handleLearnMore(product._id)}
            >
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
