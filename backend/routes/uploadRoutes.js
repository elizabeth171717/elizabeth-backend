// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/uploadController");

// Matches: /api/:client/upload-image
router.post("/:client/upload-image", uploadImage);

module.exports = router;
