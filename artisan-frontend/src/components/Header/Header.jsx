import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logoIcon from "../../assets/artisan-logo.png";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuClick = () => {
    setMenuOpen(false);
  };
  return (
    <nav>
      <div className="logo-title">
        <img src={logoIcon} alt="" className="logo" />
        <Link to="/" className="site-title">
          Artisan Optics
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
          <NavLink to="/about">Cart</NavLink>
        </li>
        <li onClick={handleMenuClick}>
          <NavLink to="/cam">Profile</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
