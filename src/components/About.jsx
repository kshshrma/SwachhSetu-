import React from 'react';

const About = () => {
  return (
    <section className="section" id="about">
      <h2 className="section-heading">About Us</h2>
      <p style={{ textAlign: 'center' }}>
        Our mission is to empower citizens and foster a cleaner, healthier environment by providing a seamless, reliable platform for reporting waste and sanitation issues. We believe that by giving every citizen a voice, we can create a collaborative network that holds local authorities accountable and drives positive change in our communities.
      </p>
      <img src="src/assets/Gemini_Generated_Image_y9q3vqy9q3vqy9q3.png" alt="Description of the image" alt="A description"
  style={{
    width: '100%',
    maxWidth: '600px',
    height: '400px',
    display: 'block',
    margin: '0 auto',
    borderRadius: '10px'
  }}/>
    </section>
  );
};

export default About;