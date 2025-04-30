import { motion } from "framer-motion";
import { useState } from "react";

import SuccessModal from "../components/SuccessModal";

// Determine the backend URL based on the environment
const BACKEND_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PRODUCTION
    : import.meta.env.VITE_BACKEND_URL_DEVELOPMENT;

const Homepage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [showModal, setShowModal] = useState(false); // State to show modal

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Disable scrolling
    document.body.style.overflow = "hidden";

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(true); // Show success modal
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting.");
    }

    // Re-enable scrolling
    document.body.style.overflow = "auto";
    setIsSubmitting(false);
  };

  return (
    <div className="main-container">
      <div className="hero-section">
        <div className="hero-title">
          <div className="hero-subtitle">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Elizabeth-Web Developer
            </motion.h2>
          </div>
          <h3>Costumers are searching online - Help them find you.</h3>
        </div>
      </div>

      <div className="contact-container">
        <div className="title">
          <h1 className="subtitle"> Let&apos;s work together</h1>
          <p>
            Fill Out these Form- Describe your Business & the service you need!
          </p>
        </div>

        {/* ✅ Show modal when form is submitted */}
        {showModal && (
          <SuccessModal
            message="I will get back to you ASAP!"
            onClose={() => setShowModal(false)}
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
          />
          <br />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="\d{10}"
            title="Phone number must be 10 digits"
          />
          <br />

          <textarea
            name="message"
            placeholder="I own  a construction company and need a website"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <br />

          {/* Submit button with loading state */}
          <button
            type="submit"
            className={`submit-button ${isSubmitting ? "disabled" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <footer>
        <p>Elizabeth. All rights reserved 2025 </p>
      </footer>
    </div>
  );
};

export default Homepage;
