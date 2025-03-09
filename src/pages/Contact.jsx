import { useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import SuccessModal from "../components/SuccessModal";

// Determine the backend URL based on the environment
const BACKEND_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PRODUCTION
    : import.meta.env.VITE_BACKEND_URL_DEVELOPMENT;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [showModal, setShowModal] = useState(false); // State to show modal

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="contact-container">
      <h2>Hit me up</h2>

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
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <br />

        <button type="submit">Send</button>
      </form>

      <div className="contact-icons">
        <a href="https://github.com/yourprofile">
          <FaGithub />
        </a>
        <a href="https://linkedin.com/in/yourprofile">
          <FaLinkedin />
        </a>
        <a href="mailto:youremail@gmail.com">
          <FaEnvelope />
        </a>
      </div>
    </div>
  );
};

export default Contact;
