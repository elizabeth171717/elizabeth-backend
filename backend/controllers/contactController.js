const contactSchema = require('../models/Contact'); // define a shared schema file
const getTenantDB = require('../utils/getTenantDB');
const tenantConfigs = require('../config/tenantConfigs');
const sendEmail = require('../utils/sendTenantEmail');

const handleContactForm = async (req, res) => {
  const { client } = req.params;
 
  const { name, email, phone, service } = req.body;

  const tenant = tenantConfigs[client];
  if (!tenant) {
    return res.status(400).json({ success: false, message: 'Unrecognized client' });
  }

  const emailRegex = /^[\w\-.]+@[\w\-.]+\.\w+$/;
  const phoneRegex = /^\d{10}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number (must be 10 digits)' });
  }

  try {
    const db = await getTenantDB(client);
   
const Contact = db.models.Contact || db.model('Contact', contactSchema); // ✅ safe model registration
    const newContact = new Contact({ name, email, phone, service });
    await newContact.save();

    // 📨 Send Thank-You + Owner Notification
    await sendEmail(email, name, service, phone, client);

    return res.status(201).json({ success: true, message: `${client} contact form submitted!` });
  } catch (error) {
    console.error("❌ Contact Form Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { handleContactForm };
