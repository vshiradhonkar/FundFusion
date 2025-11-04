import React from "react";
import "./Home.css";
import Vision from "./Vision";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">
          Welcome to <span>FundFusion PitchHub</span> 💜
        </h1>
        <p className="home-text">
          Connect startups, investors, and admins — all in one platform.
        </p>
        <div className="home-buttons">
          <a href="/register" className="home-btn">
            Get Started
          </a>
          <a href="/login" className="home-btn secondary">
            Login
          </a>
        </div>
      </div>
      <Vision/>
    </div>
  );
};

export default Home;
