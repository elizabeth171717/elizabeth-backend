require("dotenv").config();
const nodemailer = require("nodemailer");
const tenantConfigs = require("../config/tenantConfigs");

async function sendAnahuacEmail(userEmail, userName, restaurantName,  client) {
  const tenant = tenantConfigs[client];

  if (!tenant) {
    console.error(`❌ No email config found for client: ${client}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: tenant.EMAIL_SERVICE,
    auth: {
      user: tenant.EMAIL_USER,
      pass: tenant.EMAIL_PASS,
    },
  });

  try {
    const mailOptions = {
      from: tenant.EMAIL_USER,
      to: userEmail,
      subject: "Welcome 🎉",
      html: `
        <h2>Welcome, ${userName} 🎉</h2>
        <p>We're excited to help you manage <b>${restaurantName}</b>.</p>
         <br/>
        <p>— The Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to: ${userEmail}`);

  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
}

module.exports = sendAnahuacEmail;
