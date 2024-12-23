import React from "react";
import { FaFacebookF, FaYoutube, FaTwitter } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h2>About the App</h2>
            <p>
              Artisan Orion is a Bangladesh based telescope selling website. Buy
              your desired telescope from us and be a star hunter.
            </p>
          </div>
          <div className="footer-section social-links">
            <h2>Follow Us</h2>
            <div className="social-icon">
              <div>
                <a
                  href="https://www.facebook.com/camsust"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF />
                </a>
              </div>
              <div>
                <a
                  href="https://www.youtube.com/@cam-sust7650"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube />
                </a>
              </div>
              <div>
                <a
                  href="https://x.com/camsust"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-section developer">
            <h2>Developer</h2>
            <a
              href="https://github.com/ChoncholKumarRay"
              target="_blank"
              rel="noopener noreferrer"
            >
              Developer's GitHub
            </a>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <p>© Copyright - Artisan Orion </p>
      </div>
    </>
  );
};

export default Footer;
