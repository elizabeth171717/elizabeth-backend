import PropTypes from "prop-types";

function SubmissionCard({ submission }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "15px",
      }}
    >
      <h3>{submission.name}</h3>
      <p>
        <strong>Email:</strong> {submission.email}
      </p>
      <p>
        <strong>Phone:</strong> {submission.phone}
      </p>
      <p>
        <strong>Message:</strong> {submission.message}
      </p>
    </div>
  );
}

// ✅ Define prop types (important to avoid warnings)
SubmissionCard.propTypes = {
  submission: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    _id: PropTypes.string, // optional, but useful
  }).isRequired,
};

export default SubmissionCard;
