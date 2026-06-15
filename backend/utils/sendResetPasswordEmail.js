require("dotenv").config();
const nodemailer = require("nodemailer");
const tenantConfigs = require("../config/tenantConfigs");

async function sendResetPasswordEmail(
  userEmail,
  userName,
  resetLink,
  client
) {
  const tenant = tenantConfigs[client];

  const transporter = nodemailer.createTransport({
    service: tenant.EMAIL_SERVICE,
    auth: {
      user: tenant.EMAIL_USER,
      pass: tenant.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: tenant.EMAIL_USER,
    to: userEmail,
    subject: "Reset Your Password 🔑",
    html: `
      <h2>Hi ${userName} 👋</h2>

      <p>You requested a password reset.</p>

      <p>
        Click the link below to choose a new password:
      </p>

      <p>
        <a href="${resetLink}">
          Reset My Password
        </a>
      </p>

      <p>
        This link expires in 15 minutes.
      </p>

      <p>
        If you didn't request this, you can ignore this email.
      </p>

      <p>— The Team</p>
    `,
  });

  console.log(`✅ Reset email sent to: ${userEmail}`);
}

module.exports = sendResetPasswordEmail;