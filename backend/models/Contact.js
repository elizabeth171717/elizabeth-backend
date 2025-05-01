
  const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
}, { timestamps: true }); // Optional but recommended

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
