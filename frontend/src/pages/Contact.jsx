import React from "react";
import "./Contact.css";

const Contact = () => {
  const handleContactClick = () => {
    
    const email = "vedant.shiradhonkar.cmaug25@gmail.com";
    const subject = encodeURIComponent("Inquiry about FundFusion PitchHub");
    const body = encodeURIComponent(
      "Hi ,\n\nI wanted to reach out regarding..."
    );

    //go to Gmail in compose mode
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
      "_blank"
    );
  };

  return (
    <div className="page-container contact-page">
      <section className="contact-hero">
        <h1 className="contact-title">
          Need <span>Assistance?</span>
        </h1>
        <p className="contact-subtitle">
          Having a problem or need help? Our team is just one email away.
        </p>
      </section>

      <div className="contact-action">
        <button className="primary-btn" onClick={handleContactClick}>
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default Contact;
