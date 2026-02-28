import React from 'react';

const Navbar = () => {
  const handleSignUpClick = (e) => {
    e.preventDefault();
    alert('Redirecting to Sign Up page...');
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    alert('Redirecting to Sign In page...');
  };

  return (
    <nav className="navbar">
      <a href="/#home" className="logo">
        <span className="logo-part-1">Swachh</span>
        <span className="logo-part-2">Setu</span>
      </a>
      <div className="nav-links">
        <a href="/#home">Hero</a>
        <a href="/#about">About Us</a>
        <a href="/#procedure">Procedure</a>
        <a href="/#ranking">Issues</a>
        <a href="/#contact">Contact</a>
      </div>
      <div className="auth-buttons">
        <a href="#" className="signup" onClick={handleSignUpClick}>Sign Up</a>
        <a href="#" className="signin" onClick={handleSignInClick}>Sign In</a>
      </div>
    </nav>
  );
};

export default Navbar;