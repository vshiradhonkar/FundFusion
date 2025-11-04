import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We’ll get back to you shortly.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="page-container contact-page">
      <section className="contact-hero">
        <h1 className="contact-title">Get in <span>Touch</span></h1>
        <p className="contact-subtitle">
          Have a question, suggestion, or partnership idea? Drop us a message.
        </p>
      </section>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="primary-btn">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
