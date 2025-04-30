const Form = require('../models/Contact'); // your existing form model

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log("LOGIN ATTEMPT:", username, password); // 👈 log attempt
  console.log("ENV CREDENTIALS:", process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD); // 👈 check values


  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({ success: true, token: "mock-admin-token" });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
};


const getSubmissions = async (req, res) => {
  try {
    const submissions = await Form.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

module.exports = {loginAdmin, getSubmissions };
