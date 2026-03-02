require("dotenv").config();
const nodemailer = require("nodemailer");
const tenantConfigs = require("../config/tenantConfigs");

async function sendVerificationEmail(userEmail, userName, restaurantName, code, client) {
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
      subject: "Confirm Your Email 🔐",
      html: `
        <h2>Hi ${userName} 👋</h2>
        <p>You're verifying your account for <b>${restaurantName}</b>.</p>

        <p>Your confirmation code is:</p>

        <h1 style="letter-spacing: 4px;">${code}</h1>

        <p>This code expires in <b>15 minutes</b>.</p>

        <br/>
        <p>If you didn’t request this, you can ignore this email.</p>
        <p>— The Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to: ${userEmail}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
  }
}

module.exports = sendVerificationEmail;
