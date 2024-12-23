import React from "react";
import "./Gallery.css";

import telescope1 from "../../assets/telescope-1.jpg";
import telescope2 from "../../assets/telescope-2.jpg";
import telescope3 from "../../assets/telescope-3.jpg";

const Gallery = () => {
  const products = [
    {
      id: 1021,
      name: "Gskyer 600x90mm AZ Astronomical Refractor Telescope",
      price: "$399.99",
      image: telescope1,
    },
    {
      id: 1022,
      name: "Celestron NexStar 8SE Computerized Telescope",
      price: "$299.99",
      image: telescope2,
    },
    {
      id: 1023,
      name: "Meade Telescope ACF-SC 356/2848 UHTC Starlock LX850 GoTo ",
      price: "$249.99",
      image: telescope3,
    },
  ];

  return (
    <div className="gallery">
      {products.map((product) => (
        <div key={product.id} className="card">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{product.price}</p>
          <button className="learn-more">Learn More</button>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
