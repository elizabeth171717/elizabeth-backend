
require("dotenv").config();
const nodemailer = require("nodemailer");
const tenantConfigs = require("../config/tenantConfigs");

async function sendExceVerificationEmail(
  order,
  client = "exceStore"
) {
  const tenant = tenantConfigs[client];

  if (!tenant) {
    console.error(`❌ No email config found for client: ${client}`);
    return;
  }

  const customerName = order.customerInfo?.name || "Customer";
  const customerEmail = order.customerInfo?.email;

  if (!customerEmail) {
    console.error("❌ Customer email is missing.");
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
    const {
      items = [],
      fulfillment,
      deliveryAddress,
      itemsTotal = 0,
      tax = 0,
      deliveryFee = 0,
      orderTotal = 0,
      orderNumber,
    } = order;

    const money = (amount) =>
      `$${Number(amount || 0).toFixed(2)}`;

    const itemRows = items
      .map((item) => {
        const name = item.name || "Store item";
        const quantity = Number(item.quantity || 1);
        const price = Number(item.price || 0);

        return `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
              <strong>${name}</strong>
              ${item.description ? `<br>${item.description}` : ""}
              ${item.color ? `<br>Color: ${item.color}` : ""}
              ${item.size ? `<br>Size: ${item.size}` : ""}
              <br>Quantity: ${quantity}
            </td>
            <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #eee;">
              ${money(price * quantity)}
            </td>
          </tr>
        `;
      })
      .join("");

    let addressText = "";

    if (deliveryAddress) {
      if (typeof deliveryAddress === "string") {
        addressText = deliveryAddress;
      } else {
        addressText = [
          deliveryAddress.street || deliveryAddress.address,
          deliveryAddress.city,
          deliveryAddress.state,
          deliveryAddress.zip,
        ]
          .filter(Boolean)
          .join(", ");
      }
    }

    const deliverySection =
      fulfillment === "delivery" && addressText
        ? `
          <h3>Delivery Address</h3>
          <p>${addressText}</p>
        `
        : "";

    const orderSummary = `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 24px;
        border: 1px solid #eee;
        color: #333;
        line-height: 1.5;
      ">
        <h1 style="text-align: center;">Elizabeth's World</h1>

        <p>Hi ${customerName},</p>

        <p>
          Thank you for your order! Here is your order confirmation
          and receipt.
        </p>

        ${
          orderNumber
            ? `<p><strong>Order Number:</strong> ${orderNumber}</p>`
            : ""
        }

        <p><strong>Email:</strong> ${customerEmail}</p>

        <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 8px;">
          Order Summary
        </h2>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left;">Item</th>
              <th style="text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows || `
              <tr>
                <td colspan="2">No items found.</td>
              </tr>
            `}
          </tbody>
        </table>

        <table style="width: 100%; margin-top: 20px;">
          <tr>
            <td>Items Subtotal</td>
            <td style="text-align: right;">${money(itemsTotal)}</td>
          </tr>

          <tr>
            <td>Tax</td>
            <td style="text-align: right;">${money(tax)}</td>
          </tr>

          ${
            Number(deliveryFee) > 0
              ? `
                <tr>
                  <td>Delivery Fee</td>
                  <td style="text-align: right;">${money(deliveryFee)}</td>
                </tr>
              `
              : ""
          }

          <tr>
            <td style="padding-top: 12px; border-top: 1px solid #ddd;">
              <strong>Order Total</strong>
            </td>
            <td style="text-align: right; padding-top: 12px; border-top: 1px solid #ddd;">
              <strong>${money(orderTotal)}</strong>
            </td>
          </tr>
        </table>

        ${deliverySection}

        <p style="margin-top: 30px; text-align: center; color: #777;">
          Thank you for shopping with Elizabeth's World!
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Elizabeth's World" <${tenant.EMAIL_USER}>`,
      to: customerEmail,
      subject: orderNumber
        ? `Order Confirmation - ${orderNumber}`
        : "Your Elizabeth's World Order Confirmation",
      html: orderSummary,
    });

    console.log(`✅ Order receipt sent to ${customerEmail}`);
  } catch (error) {
    console.error("❌ Error sending Exce receipt:", error);
  }
}

module.exports = sendExceVerificationEmail;
