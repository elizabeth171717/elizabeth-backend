const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const { connectDB } = require("./db"); // Import database connection
const sendEmail = require('./sendEmail'); // Import email function
const app = express();


// CORS configuration for production
const corsOptions = {
  origin: "https://elizabeth-backend-1.onrender.com", // Set this to your actual frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

// Middleware
app.use(cors(corsOptions)); // Make sure to pass the corsOptions here
app.use(express.json()); // Use express.json() instead of bodyParser

connectDB(); // Connect to MongoDB when server starts

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// API Route to Submit Contact Form
app.post("/api/contact", async (req, res) => {
  
  try {
    const { name, email, phone, message } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }
  
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid phone number. Must be 10 digits." });
  }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

 

  // ✅ Now includes phone & message in the email!
  await sendEmail(email, name, message, phone); 

    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});




// API Route to Fetch All Contact Form Responses
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find(); // Retrieve all contact responses
    res.status(200).json(contacts); // Send them as a JSON response
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
