import PropTypes from "prop-types";

const AboutOrderForm = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="about-modal-content">
        <h3>Rricura Tamales</h3>
        <p>
          An online food ordering form designed for my mom&apos;s catering
          business. I created these responsive form using react/vite, optimizing
          the user experience with dynamic pricing calculations and order
          validation i used mongodb to store form responses. I also implemented
          email notifications for customers and myself .Deployed the application
          using Render and managed version control with GitHub. After an order
          is place I collect payments via stripe payment links.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AboutOrderForm;

// ✅ Add PropTypes validation
AboutOrderForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
