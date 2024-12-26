import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // For accessing query params
import "./styles/ProductPage.css";

// Import images locally
import telescope1 from "../assets/telescope1.jpg";
import telescope2 from "../assets/telescope2.jpg";
import telescope3 from "../assets/telescope3.jpg";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);

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

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <img
        src={imageMapping[product.image_url]}
        alt={product.name}
        className="product-image"
      />
      <p>Price: ৳ {product.price}</p>
      <p>ID: {product._id}</p>
      <p>Description: {product.description}</p>
      <p>Price: {product.price}</p>
    </div>
  );
};

export default ProductPage;
