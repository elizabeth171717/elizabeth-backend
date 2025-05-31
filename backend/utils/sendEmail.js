require('dotenv').config();
const nodemailer = require('nodemailer');
const tenantConfigs = require('../config/tenantConfigs'); // adjust path if needed

async function sendEmail(customerEmail, customerName, orderData, client) {
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

  console.log("📨 Sending email to:", customerEmail);

  try {
    const {
      orderNumber, tamales, subtotal, tax, tip, deliveryFee,
      total, deliveryDate, deliveryTime, deliveryAddress
    } = orderData;

    const tamaleSummary = tamales.map(tamale =>
      `- ${tamale.quantity}x ${tamale.name} ($${tamale.basePrice.toFixed(2)} each)`
    ).join("\n");

    const orderSummary = `
      <div
        style="
          font-family: sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 10px solid #eee;
        "
      >
        <img
          src="https://www.rricuratamales.com/logo.png"
          alt="Rricura Logo"
          style="height: 40px; display: block; margin-bottom: 20px"
        />

        <p style="margin: 10px 0">
          <strong>Order #: ${orderData.orderNumber}</strong>
        </p>

        <!-- Customer Info -->
        <p style="color: #9d0759"><strong>Customer Information</strong></p>
        <table style="width: 100%; margin-bottom: 20px">
          <tr>
            <td style="padding: 2px 0">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 2px 0">${customerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 2px 0">${orderData.customerPhone || "N/A"}</td>
          </tr>
        </table>

        <!-- Order Details Section First -->
        <p style="color: #9d0759"><strong>Order Summary</strong></p>
        <table
          style="
            width: 100%;
            font-family: sans-serif;
            font-size: 14px;
            margin-bottom: 20px;
          "
          cellpadding="0"
          cellspacing="0"
        >
          ${tamales.map(tamale => `
          <tr>
            <td style="padding: 4px 0">${tamale.quantity}x ${tamale.name}</td>
            <td style="text-align: right; padding: 4px 0">
              $${(tamale.basePrice * tamale.quantity).toFixed(2)}
            </td>
          </tr>
          `).join("")}
          <tr>
            <td colspan="2"><hr style="border-top: 1px solid #ccc" /></td>
          </tr>
          <tr>
            <td><strong>Subtotal:</strong></td>
            <td style="text-align: right">$${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td><strong>Tax:</strong></td>
            <td style="text-align: right">$${tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td><strong>Delivery Fee:</strong></td>
            <td style="text-align: right">$${deliveryFee.toFixed(2)}</td>
          </tr>
          <tr>
            <td><strong>Tip:</strong></td>
            <td style="text-align: right">$${tip.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding-top: 8px; font-size: 16px">
              <strong>Total:</strong>
            </td>
            <td style="text-align: right; padding-top: 8px; font-size: 16px">
              <strong>$${total.toFixed(2)}</strong>
            </td>
          </tr>
        </table>

        

        <!-- Delivery Info -->
        <p style="color: #9d0759"><strong>Delivery Details</strong></p>
        <table style="width: 100%; margin-bottom: 20px">
          <tr>
            <td style="padding: 4px 0"><strong>Delivery Date</strong>: ${deliveryDate}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0"><strong>Delivery Time</strong>: ${deliveryTime}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0">
              <strong>Delivery Address</strong>:<br />
              ${deliveryAddress?.street || "N/A"}<br />
              ${deliveryAddress?.city || ""}, ${deliveryAddress?.state || ""}
              ${deliveryAddress?.zip || ""}
            </td>
          </tr>
        </table>

        <p style="margin-top: 30px; font-size: 0.9em; color: #666">
          Thank you for ordering from
          <strong>Rricura Tamales Mexicanos</strong>!
        </p>
      </div>
      `;

    const customerMailOptions = {
      from: tenant.EMAIL_USER,
      to: customerEmail,
      subject: 'Your Tamale Order Confirmation',
      
      html: orderSummary, // 👈 use the HTML version
    };

    await transporter.sendMail(customerMailOptions);
    console.log(`✅ Receipt email sent to customer: ${customerEmail} (Order #${orderNumber})`);

    if (!tenant.OWNER_EMAIL) {
      console.error("❌ OWNER_EMAIL missing for tenant:", client);
      return;
    }

    const ownerMailOptions = {
      from: tenant.EMAIL_USER,
      to: tenant.OWNER_EMAIL,
      subject: 'New Order Received!',
      text: `🚀 New customer order received!\n\nName: ${customerName}\nEmail: ${customerEmail}\nOrder Details:\n${JSON.stringify(orderData, null, 2)}`
    };

    await transporter.sendMail(ownerMailOptions);
    console.log("✅ Notification email sent to OWNER!");

  } catch (error) {
    console.error('❌ Error sending emails:', error);
  }
}

module.exports = sendEmail;

