
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
}, { timestamps: true }); // Optional but recommended


module.exports = contactSchema; // ✅ export schema, not model