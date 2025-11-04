import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="page-container about-page">
      <section className="about-hero">
        <h1 className="about-title">About <span>FundFusion PitchHub</span></h1>
        <p className="about-tagline">
          Empowering startups. Connecting investors. Fueling innovation.
        </p>
      </section>

      <section className="about-content">
        <p>
          FundFusion PitchHub is a next-generation platform designed to bridge the gap 
          between visionary startups and forward-thinking investors. We believe great ideas 
          shouldn’t struggle to find the right backers — and that’s why we’re here.
        </p>
        <p>
          Our mission is to simplify fundraising through transparency, accessibility, and 
          intelligent technology. Whether you’re an entrepreneur seeking your first investor 
          or a seasoned investor looking for the next breakthrough, FundFusion provides the 
          tools and visibility you need.
        </p>
        <p>
          Built with innovation and collaboration at its core, our platform allows you to 
          pitch, invest, and grow — all within a secure, efficient ecosystem.
        </p>
      </section>
    </div>
  );
};

export default About;
