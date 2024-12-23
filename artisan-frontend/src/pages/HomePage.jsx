import React from "react";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Footer from "../components/Footer/Footer";

const HomePage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <div>
        <h1>Welcome to the E-commerce Site</h1>
        <p>Browse our products and start shopping today!</p>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
