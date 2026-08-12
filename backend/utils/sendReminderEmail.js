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
          🍎 RECORDATORIO DE SNACK
        </h2>

        <p style="font-size:18px;">Hola ${parentName},</p>

        <p style="font-size:18px;"><strong>
         
          Este es un recordatorio que hoy es tu turno de traer snacks para la clase
        </p></strong>

        <p style="font-size:18px;">
         
          Gracias por ayudar aser el tiempo de snack, un momento especial para los ninos!
        </p>

        <hr/>

        <p style="font-size:12px;color:#777;">
          This reminder was sent automatically by the Snack List App.
        </p>

      </div>
    `;

    await transporter.sendMail({
      from: `"BHOP SNACK" <${tenant.EMAIL_USER}>`,
      to,
      subject: `Recordatorio de Snack - ${listName}`,
      html,
    });

    console.log(`✅ Reminder sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send reminder email:", err);
    throw err;
  }
}

module.exports = sendReminderEmail;