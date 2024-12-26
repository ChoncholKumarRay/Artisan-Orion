import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // For accessing query params
import "./styles/ProductPage.css";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);

  const productId = searchParams.get("id"); // Get the product ID from the URL

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
        src={product.image_url}
        alt={product.name}
        className="product-image"
      />
      <p>Price: ৳ {product.price}</p>
      <p>ID: {product._id}</p>
    </div>
  );
};

export default ProductPage;
