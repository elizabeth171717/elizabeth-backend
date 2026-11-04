
const express = require("express");
const router = express.Router();

const {
  uploadCustomerDesign,
} = require("../controllers/exceUploadController");

// Add the console.log here
console.log("✅ EXCE UPLOAD ROUTE FILE LOADED");

router.post("/:client/upload-design", uploadCustomerDesign);

module.exports = router;
