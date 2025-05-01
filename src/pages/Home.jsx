import { motion } from "framer-motion";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faFacebook } from "@fortawesome/free-brands-svg-icons";

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
    service: "",
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
      <div className="site-intro">
        <div className="site-name">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Elizabeth TR
          </motion.h2>
          <a href="https://www.facebook.com/profile.php?id=61575876650894">
            <FontAwesomeIcon icon={faFacebook} />{" "}
          </a>
        </div>
        <h3>Professional and Modern Website Design</h3>
      </div>

      <section className="contact-form">
        <div className="title-container">
          <h1 className="subtitle"> Fill Out these Form to get started</h1>
          <p>Your business exists — let’s make sure the world sees it Today</p>
        </div>

        {/* ✅ Show modal when form is submitted */}
        {showModal && (
          <SuccessModal
            message="I will get back to you ASAP!"
            onClose={() => setShowModal(false)}
          />
        )}

        <form className="form" onSubmit={handleSubmit}>
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

          <select
            name="service"
            value={formData.message}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a service
            </option>

            <option value="Website Design">Website Design</option>
            <option value="Website Redesign">Website Redesign</option>
            <option value="Website Optimization">Website Optimization</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Email Setup">Email Setup</option>
            <option value="Google My Business">Google My Business</option>
            <option value="Translations">Translations</option>
            <option value="HTML Tutorial">HTML Tutorial</option>
            <option value="CSS Tutorial">CSS Tutorial</option>
          </select>

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
      </section>

      <footer>
        <p>Elizabeth. All rights reserved 2025 </p>
      </footer>
    </div>
  );
};

export default Homepage;
