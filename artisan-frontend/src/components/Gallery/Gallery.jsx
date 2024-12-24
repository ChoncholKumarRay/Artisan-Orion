import React, { useEffect, useState } from "react";
import "./Gallery.css";

// Import images locally
import telescope1 from "../../assets/telescope1.jpg";
import telescope2 from "../../assets/telescope2.jpg";
import telescope3 from "../../assets/telescope3.jpg";

const Gallery = () => {
  // State to store fetched product data
  const [products, setProducts] = useState([]);

  // Image mapping based on the image name stored in the database
  const imageMapping = {
    telescope1: telescope1,
    telescope2: telescope2,
    telescope3: telescope3,
  };

  // Fetch products data when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace with your backend API endpoint
        const response = await fetch(
          "https://artisan-orion.onrender.com/api/products"
        );
        const data = await response.json();

        // Set fetched data to state
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means it runs only once after the first render

  return (
    <div className="gallery">
      {products.map((product) => (
        <div key={product._id} className="card">
          {/* Dynamically load the image using the mapping */}
          <img
            src={imageMapping[product.image_url]} // Fetch the correct image based on image_url
            alt={product.name}
            className="product-image"
          />
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">৳ {product.price}</p>
          <button className="learn-more">Learn More</button>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
