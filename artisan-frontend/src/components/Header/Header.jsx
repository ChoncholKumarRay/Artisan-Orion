import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import logoIcon from "../../assets/artisan-logo.png";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in by checking the localStorage
  useEffect(() => {
    const artisan = localStorage.getItem("artisan");
    if (artisan) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleMenuClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav>
      <div className="logo-title">
        <img src={logoIcon} alt="" className="logo" />
        <Link to="/" className="site-title">
          Artisan Orion
        </Link>
      </div>
      <div
        className="menu"
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li onClick={handleMenuClick}>
          <NavLink to="/">Home</NavLink>
        </li>
        <li onClick={handleMenuClick}>
          <NavLink to="/cart">Cart</NavLink>
        </li>

        {isLoggedIn ? (
          <li onClick={handleMenuClick}>
            <NavLink to="/profile">Profile</NavLink>
          </li>
        ) : (
          <li onClick={handleMenuClick}>
            <NavLink to="/login">Login</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
