require('dotenv').config();
const nodemailer = require('nodemailer');
const tenantConfigs = require('../config/tenantConfigs'); // adjust path if needed

async function sendEmail(customerEmail, customerName, customerService, customerPhone, client) {
  const tenant = tenantConfigs[client];

  if (!tenant) {
    console.error(`❌ No email config found for client: ${client}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: tenant.EMAIL_SERVICE,
    auth: {
      user: tenant.EMAIL_USER,
      pass: tenant.EMAIL_PASS
    }
  });

  try {
    const customerMailOptions = {
      from: tenant.EMAIL_USER,
      to: customerEmail,
      subject: 'Thank You for Contacting Me!',
      text: `Hi ${customerName},\n\nThank you for reaching out! I'm very excited to start working on your project.\n
Before we move to pricing, and to ensure you get a fair price, I would like to know what type of Business you own, 
and what type of services you offer.

\n\nBest,\nElizabeth`
    };

    await transporter.sendMail(customerMailOptions);
    console.log(`✅ Thank-you email sent to: ${customerEmail}`);

    if (!tenant.OWNER_EMAIL) {
      console.error("❌ OWNER_EMAIL is missing for tenant:", client);
      return;
    }

    console.log("📨 Preparing notification email to owner:", tenant.OWNER_EMAIL);

    const ownerMailOptions = {
      from: tenant.EMAIL_USER,
      to: tenant.OWNER_EMAIL,
      subject: 'New Contact Form Submission!',
      text: `🚀 New customer inquiry received!\n\nName: ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone || "No phone provided"}\nService:\n${customerService}`
    };

    await transporter.sendMail(ownerMailOptions);
    console.log("✅ Notification email sent to OWNER!");

  } catch (error) {
    console.error('❌ Error sending emails:', error);
  }
}

module.exports = sendEmail;
