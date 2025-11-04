import React from "react";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <h3 className="footer-brand">
          FundFusion <span>PitchHub</span>
        </h3>
        <p className="footer-tagline">Empowering Innovation. Connecting Visionaries.</p>
        <p className="footer-copy">
          © {year} FundFusion PitchHub • All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
