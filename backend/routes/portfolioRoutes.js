const express = require("express");
const router = express.Router();
const contactSchema = require("../models/Contact");
const getTenantDB = require("../utils/getTenantDB");

router.get("/:client/contacts", async (req, res) => {
  const { client } = req.params;
  const { name, email } = req.query;

  const filters = {};

  if (name) {
    filters.name = { $regex: name, $options: "i" };
  }

  if (email) {
    filters.email = email; // exact match
  }


  try {
    const db = await getTenantDB(client);
    const Contact = db.model("Contact", contactSchema);

    const contacts = await Contact.find(filters).sort({ createdAt: -1 });

    res.json(contacts);
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    res.status(500).json({ message: "Error fetching contact responses" });
  }
});



module.exports = router;
