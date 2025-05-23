const express = require('express');
const router = express.Router({ mergeParams: true });
const { handleContactForm } = require('../controllers/contactController');

// Matches: /api/contact/:client

router.post("/:client/contact", handleContactForm); // dynamic route

module.exports = router;
