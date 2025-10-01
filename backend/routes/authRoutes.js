// authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { users } = require("../users.js");
require("dotenv").config();

const router = express.Router();

// POST /login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: "admin" },
    process.env.DASHBOARD_JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.DASHBOARD_JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}

// Example protected test route (you can delete later)
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are logged in!", user: req.user });
});

module.exports = router;
