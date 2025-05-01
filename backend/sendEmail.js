require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(customerEmail, customerName, customerService, customerPhone) {
  try {
   

    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Thank You for Contacting Me!',
      text: `Hi ${customerName},\n\nThank you for reaching out! I'm very excited to start working on your project.\n
      Before we move to pricing, and to ensure you get a fair price, I would like to know what type of  Business do you own, 
      and what type of services you offer.
      
     \n\nBest,\nElizabeth`
    };

    await transporter.sendMail(customerMailOptions);
   

    // 🔥 DEBUG: Check if OWNER_EMAIL exists
    if (!process.env.OWNER_EMAIL) {
      console.error("❌ OWNER_EMAIL is missing in .env file!");
      return;
    }

    console.log("📨 Preparing notification email to owner:", process.env.OWNER_EMAIL);

    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL, 
      subject: 'New Contact Form Submission!',
      text: `🚀 New customer inquiry received!\n\nName: ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone || "No phone provided"}\nService:\n${customerService}`
    };

    await transporter.sendMail(ownerMailOptions);
    console.log("✅ Notification email sent to OWNER, you!");

  } catch (error) {
    console.error('❌ Error sending emails:', error);
  }
}

module.exports = sendEmail;
