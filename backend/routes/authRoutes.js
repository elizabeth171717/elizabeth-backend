// routes/authRoutes.js
const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });



// Matches: /api/:client/signup → dashboard is a client here
router.post("/:client/signup", signup);
router.post("/:client/login", login);

module.exports = router;
