import { useEffect } from "react";
import PropTypes from "prop-types";

const SuccessModal = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Thank You!</h2>
        <p className="modal-message">{message}</p>
        <button className="modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

SuccessModal.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SuccessModal;
