import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;

    const handleMouseMove = (e) => {
      const particle = document.createElement('span');
      particle.className = 'shimmer-particle';
      particle.style.left = `${e.clientX - 5}px`;
      particle.style.top = `${e.clientY - 5}px`;

      heroElement.appendChild(particle);

      // Remove the particle after its animation ends to prevent memory leaks
      particle.addEventListener('animationend', () => {
        particle.remove();
      });
    };

    heroElement.addEventListener('mousemove', handleMouseMove);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      heroElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleReportClick = (e) => {
    e.preventDefault();
    alert('Redirecting to the Report a Problem page...');
  };

  return (
    <header className="hero" section ="home"ref={heroRef}>
      <h1>Empowering Citizens for a Cleaner City</h1>
      <p>Report garbage and waste problems with a photo. We'll automatically geo-tag the location and notify local authorities to ensure swift action.</p>

      <section className="section call-to-action">
        <a href="/report" className="cta-button" onClick={handleReportClick}>REPORT PROBLEM</a>
      </section>
    </header>
  );
};

export default Hero;