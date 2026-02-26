import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="navbar">
        <div className="logo">
          Bharat<span>Verse</span>
        </div>

        <div
          className="hamburger"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </div>
      </div>

      <div className={`mobile-menu ${open ? "active" : ""}`}>
        <p onClick={() => setOpen(false)}>Hero</p>
        <p onClick={() => setOpen(false)}>About Us</p>
        <p onClick={() => setOpen(false)}>Procedure</p>
        <p onClick={() => setOpen(false)}>Issues</p>
        <p onClick={() => setOpen(false)}>Contact</p>
        <p onClick={() => setOpen(false)}>Sign Up</p>
        <p onClick={() => setOpen(false)}>Sign In</p>
      </div>
    </>
  );
}