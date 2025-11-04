import React from "react";
import "./Vision.css";

const Vision = () => {
  return (
    <section className="vision-section">
      <div className="vision-container">
        <h2 className="vision-title">
          Our <span>Vision</span>
        </h2>
        <p className="vision-subtitle">
          Empowering startups and investors through transparent, data-driven, and
          community-focused innovation.
        </p>

        <div className="vision-cards">
          <div className="vision-card">
            <h3>🚀 Innovation</h3>
            <p>
              We believe in fueling creative ideas with the resources they need to
              thrive — connecting innovators and investors globally to push the
              boundaries of what’s possible.
            </p>
          </div>

          <div className="vision-card">
            <h3>🤝 Collaboration</h3>
            <p>
              A thriving ecosystem is built on partnership. We bridge startups and
              investors for meaningful, sustainable growth through shared goals and
              mutual trust.
            </p>
          </div>

          <div className="vision-card">
            <h3>🌍 Impact</h3>
            <p>
              Our mission goes beyond profit — we aim to create solutions that drive
              sustainability, empower local economies, and inspire global change.
            </p>
          </div>

          <div className="vision-card">
            <h3>💡 Empowerment</h3>
            <p>
              We’re not just funding ideas — we’re empowering people. By democratizing
              access to opportunities, we enable every entrepreneur and investor to
              play a vital role in shaping the future.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
