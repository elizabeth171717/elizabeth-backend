import PropTypes from "prop-types";

const AboutGymWebsite = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="about-modal-content">
        <h3>Olvera Martial Arts</h3>
        <p>
          This project is a website for a Taekwondo gym. It features responsive
          design smooth animations and engaging user experience. The owner
          wanted to make it easy for people to find the gym and contact him, so
          I used a fixed navigation bar that contains phone number, location,
          gym hours,and social media icons along with text slider with the same
          information. Next I used cards to display the classes the gym offers,
          in each card there is a class image, description and CTA . I included
          google analitycs to track site traffic and engagemant. I have been
          working on these project 3 years now.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// ✅ Add PropTypes validation
AboutGymWebsite.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AboutGymWebsite;
