import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="page-container about-page">
  
      <section className="about-hero">
        <h1 className="about-title">
          About <span>FundFusion PitchHub</span>
        </h1>
        <p className="about-tagline">
          Empowering startups. Connecting investors. Fueling innovation.
        </p>
      </section>

    
      <section className="about-content">
        <p>
          <strong>FundFusion PitchHub</strong> is a next-generation platform built to
          bridge the gap between visionary startups and forward-thinking investors. 
          We believe that great ideas shouldn’t struggle to find the right backers — 
          and that’s exactly what we aim to solve.
        </p>

        <p>
          Our mission is to simplify the fundraising process through transparency,
          accessibility, and intelligent technology. Whether you’re an entrepreneur 
          looking to make your first pitch or an investor scouting the next big thing, 
          FundFusion provides the clarity, connectivity, and confidence you need.
        </p>

        <p>
          Developed with innovation and collaboration at its core, our platform enables 
          users to <strong>pitch, invest, and grow</strong> — all within a secure, 
          efficient, and visually engaging ecosystem.
        </p>
      </section>

  
      <section className="about-team">
        <h2 className="team-heading">Development Team</h2>
        <div className="team-list">
          <p>👩‍💻 <strong>Vasundhara Vitthal Nanaware</strong> (PRN: 250840320228)</p>
          <p>👨‍💻 <strong>Bhagyesh Wani</strong> (PRN: 250840320041)</p>
          <p>👨‍💻 <strong>Vedant Shiradhonkar</strong> (PRN: 250840320229)</p>
        </div>

        <p className="team-note">
          This project was developed as a <strong>Mini Project</strong> for the 
          <strong> Web Programming Technologies (WPT)</strong> module under the 
          <strong> CDAC August 2025 Batch</strong> at <strong>CDAC Kharghar, Mumbai</strong>.
        </p>

        <p className="tech-stack">
          <strong>Tech Stack Used:</strong> React.js, Node.js, Express.js, MySQL, 
          Toastify, and modern CSS with a custom responsive dark theme.
        </p>
      </section>
    </div>
  );
};

export default About;
