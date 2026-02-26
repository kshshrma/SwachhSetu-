import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className="footer" section="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section about-us">
              <h3>SwachhSetu</h3>
              <p>Empowering communities to report waste and sanitation issues and drive positive change for a cleaner, healthier environment.</p>
            </div>
            <div className="footer-section contact-info">
              <h3>Contact Us</h3>
              <p>Email: contact@swachhsetu.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Address: 123 Clean City Lane, New Delhi, India</p>
            </div>
            <div className="footer-section social-links">
              <h3>Follow Us</h3>
              
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f" ></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <div className="whatsapp-float">
        <a href="https://wa.me/7084812337" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-whatsapp whatsapp-icon"></i>
          
        </a>
      </div>
    </>
  );
};

export default Footer;