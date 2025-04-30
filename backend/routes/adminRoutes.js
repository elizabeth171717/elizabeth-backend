const express = require('express');
const router = express.Router();
const { loginAdmin, getSubmissions } = require('../controllers/adminController');
const protectAdminRoute = require('../middleware/auth');

// Optional: Add auth middleware here
router.post("/login", loginAdmin);
router.get('/submissions', protectAdminRoute, getSubmissions);

module.exports = router;
