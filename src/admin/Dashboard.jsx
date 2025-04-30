// src/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmissionCard from "./SubmissionCard";
// Determine the backend URL based on the environment
const BACKEND_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PRODUCTION
    : import.meta.env.VITE_BACKEND_URL_DEVELOPMENT;

const Dashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Remove the token
    navigate("/login"); // Redirect to login page
  };
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(`${BACKEND_URL}/api/admin/submissions`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          // Token is missing or invalid — redirect to login
          navigate("/login");
          return;
        }

        const data = await res.json();

        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setSubmissions(sortedData);
      } catch (err) {
        console.error("Failed to fetch submissions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();

    // Set interval to fetch every 10 seconds (10000 ms)
    const intervalId = setInterval(fetchSubmissions, 10000);

    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, [navigate]);

  if (loading) return <p className="p-4">Loading submissions...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map((submission) => (
          <SubmissionCard key={submission._id} submission={submission} />
        ))
      )}
    </div>
  );
};

export default Dashboard;
