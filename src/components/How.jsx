import React from 'react';

const How = () => {
  const steps = [
    {
      icon: "📸",
      title: "1. Report",
      desc:
        "Just upload a photo and describe the problem. We'll use your device's GPS to get the exact location.",
    },
    {
      icon: "📍",
      title: "2. Verify",
      desc:
        "Our system checks for nearby reports to avoid duplicates, ensuring our data is accurate and reliable.",
    },
    {
      icon: "✅",
      title: "3. Resolve",
      desc:
        "The most urgent and reported issues are automatically sent to local officials for a faster response.",
    },
  ];

  return (
    <section className="howsec min-h-[200vh]" section="procedure">
      <h1>Procedure</h1>

      <div className="how-it-works relative max-w-xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="step sticky transition-all duration-300 ease-out"
            style={{
              top: 120 + index * 40,          // stacking gap
              yIndex: steps.length - index,   // new card on top
              transform: `scale(${1 - index * 0.05})`,
            }}
          >
            <div className="step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default How;
