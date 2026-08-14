require("dotenv").config();
const nodemailer = require("nodemailer");
const tenantConfigs = require("../config/tenantConfigs");

async function sendReminderEmail({
  client,
  to,
  parentName,
  studentName,
  snackDate,
  listName,
  reminderType,
}) {
  try {
    const tenant = tenantConfigs[client];

    if (!tenant) {
      throw new Error(
        `No email configuration found for client: ${client}`
      );
    }

    const transporter = nodemailer.createTransport({
      service: tenant.EMAIL_SERVICE,
      auth: {
        user: tenant.EMAIL_USER,
        pass: tenant.EMAIL_PASS,
      },
    });

    // ===============================
    // FORMAT SNACK DATE IN SPANISH
    // ===============================
    const formattedDate = new Date(
      `${snackDate}T00:00:00`
    ).toLocaleDateString("es-ES", {
      timeZone: "America/New_York",
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Capitalize first letter
    const displayDate =
      formattedDate.charAt(0).toUpperCase() +
      formattedDate.slice(1);

    // ===============================
    // 3-DAY REMINDER
    // ===============================
    let message;

    if (reminderType === "threeDays") {
      message = `
        <p style="font-size:18px;">
          Este es un recordatorio de que estás programado para traer
          los snacks de la clase el día:
        </p>

        <p style="font-size:20px;">
          <strong>${displayDate}</strong>
        </p>

        <p style="font-size:18px;">
          Estudiante: <strong>${studentName}</strong>
        </p>

        <p style="font-size:18px;">
          Muchas gracias por ayudar a hacer el momento de snack
          un momento especial para los niños. 🍎
        </p>
      `;
    } else {
      // ===============================
      // SAME-DAY REMINDER
      // ===============================
      message = `
        <p style="font-size:18px;">
          Este es un recordatorio de que <strong>hoy</strong> es tu turno
          de traer snacks para la clase.
        </p>

        <p style="font-size:18px;">
          Estudiante: <strong>${studentName}</strong>
        </p>

        <p style="font-size:18px;">
          Muchas gracias por ayudar a hacer el momento de snack
          un momento especial para los niños. 🍎
        </p>
      `;
    }

    // ===============================
    // EMAIL
    // ===============================
    const html = `
      <div style="
        font-family: Arial, sans-serif;
        max-width:600px;
        margin:auto;
      ">

        <h2 style="color:#4CAF50;">
          🍎 RECORDATORIO DE SNACK
        </h2>

        <p style="font-size:18px;">
          Hola ${parentName},
        </p>

        ${message}

        <hr/>

        <p style="font-size:12px;color:#777;">
          Este recordatorio fue enviado automáticamente por
          BHOP SNACK.
        </p>

      </div>
    `;

    await transporter.sendMail({
      from: `"BHOP SNACK" <${tenant.EMAIL_USER}>`,
      to,
      subject:
        reminderType === "threeDays"
          ? `Recordatorio de Snack - ${listName}`
          : `Recordatorio de Snack para Hoy - ${listName}`,
      html,
    });

    console.log(
      `✅ ${reminderType} reminder sent to ${to}`
    );

  } catch (err) {
    console.error(
      "❌ Failed to send reminder email:",
      err
    );

    throw err;
  }
}

module.exports = sendReminderEmail;