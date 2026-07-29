require("dotenv").config();
const nodemailer = require("nodemailer");
const tenantConfigs = require("../config/tenantConfigs");

async function sendReminderEmail({
  client,
  to,
  parentName,
  studentName,
  snackDate,
  organizer,
  listName,
}) {
  try {
    const tenant = tenantConfigs[client];

    if (!tenant) {
      throw new Error(`No email configuration found for client: ${client}`);
    }

    const transporter = nodemailer.createTransport({
      service: tenant.EMAIL_SERVICE,
      auth: {
        user: tenant.EMAIL_USER,
        pass: tenant.EMAIL_PASS,
      },
    });

    const formattedDate = new Date(snackDate).toLocaleDateString("en-US", {
  timeZone: "America/New_York",
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

    const html = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">

        <h2 style="color:#4CAF50;">
          🍎 Snack Reminder
        </h2>

        <p>Hello ${parentName},</p>

        <p>
          This is a friendly reminder that you are scheduled
          to bring the snack for:
        </p>

        <table style="border-collapse:collapse;">
          <tr>
            <td style="padding:6px 12px;"><strong>Student</strong></td>
            <td>${studentName}</td>
          </tr>

          <tr>
            <td style="padding:6px 12px;"><strong>Class</strong></td>
            <td>${listName}</td>
          </tr>

          <tr>
            <td style="padding:6px 12px;"><strong>Date</strong></td>
           <td>${formattedDate}</td>
          </tr>
        </table>

        <br/>

        <p>
          Thank you for helping make snack time special for the kids!
        </p>

        <br/>

        <p>
          If you are unable to bring the snack, please contact
          <strong>${organizer}</strong>.
        </p>

        <hr/>

        <p style="font-size:12px;color:#777;">
          This reminder was sent automatically by the Snack List App.
        </p>

      </div>
    `;

    await transporter.sendMail({
      from: `"Snack List App" <${tenant.EMAIL_USER}>`,
      to,
      subject: `Snack Reminder - ${listName}`,
      html,
    });

    console.log(`✅ Reminder sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send reminder email:", err);
    throw err;
  }
}

module.exports = sendReminderEmail;