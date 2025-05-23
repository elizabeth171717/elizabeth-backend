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
      orderNumber, tamales, subtotal, tax, deliveryFee,
      total, deliveryDate, deliveryTime, deliveryAddress
    } = orderData;

    const tamaleSummary = tamales.map(tamale =>
      `- ${tamale.quantity}x ${tamale.name} ($${tamale.basePrice.toFixed(2)} each)`
    ).join("\n");

    const orderSummary = `
Hi ${customerName},

We have received your order. Here are the details:

🔹 Order Number: ${orderNumber}
🔹 Order Summary:
${tamaleSummary}
- Subtotal: $${subtotal.toFixed(2)}
- Tax: $${tax.toFixed(2)}
- Delivery Fee: $${deliveryFee.toFixed(2)}
- Total: $${total.toFixed(2)}

📦 Your order will be delivered on:
📅 Date: ${deliveryDate}
⏰ Time: ${deliveryTime}
📍 Address: ${deliveryAddress?.street || "N/A"}, ${deliveryAddress?.city || "N/A"}, ${deliveryAddress?.state || "N/A"} ${deliveryAddress?.zip || "N/A"}

Thank you for ordering from Rricura Tamales Mexicanos!
`;

    const customerMailOptions = {
      from: tenant.EMAIL_USER,
      to: customerEmail,
      subject: 'Your Tamale Order Confirmation',
      text: orderSummary,
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

