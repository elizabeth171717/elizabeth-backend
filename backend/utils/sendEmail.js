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

 try{ 
  const {
  orderNumber,
  subtotal, tax, tip = 0, total,
  deliveryDate, deliveryTime, deliveryAddress
} = orderData;


const items = orderData.items || [];


const deliveryFee = deliveryAddress?.fee || 0; // ✅ Pull it from inside deliveryAddress



const formatItemSection = (items = []) => {
  if (!items.length) return '';

  // Reuse your description logic
  const getItemDescription = (item) => {
    if (item.filling) {
      let description = `${item.filling} tamale`;
      if (item.wrapper) description += ` - ${item.wrapper}`;
      if (item.sauce && item.sauce !== "None") description += ` - ${item.sauce} sauce`;
      if (item.vegOil) description += " - Veggie Oil";
      if (item.fruit) description += " - with Fruit";
      return description;
    }
    if (item.name) return item.name;
    return "Custom item";
  };

  return `
    <table style="width: 100%; font-size: 14px;" cellpadding="0" cellspacing="0">
      ${items.map(item => {
        let labelStart;

        if (item.size) {
          labelStart = `${item.quantity} ${item.size}`;
        } else if (item.unit) {
          labelStart = `${item.quantity} ${item.unit}`;
        } else {
          labelStart = `${item.quantity}`;
        }

        const itemLabel = `${labelStart} ${getItemDescription(item)}`;

        // Make sure price is a number
        const price = parseFloat(item.price) || 0;

        return `
          <tr>
            <td style="padding: 4px 0">${itemLabel}</td>
            <td style="text-align: right; padding: 4px 0">
              $${(price * item.quantity).toFixed(2)}
            </td>
          </tr>
        `;
      }).join("")}
    </table>
  `;
};


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

        <p style="margin: 5px 0">
          <strong>Order #: ${orderData.orderNumber}</strong>
        </p>

        <!-- Customer Info -->
        <h2 style="color: #9d0759">Customer Information</h2>
        <table style="width: 100%; margin-bottom: 3px">
          <tr>
            <td>${customerName}</td>
          </tr>
          <tr>
            <td>${customerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 1px 0">${orderData.customerPhone || "N/A"}</td>
          </tr>
        </table>

       <!-- Order Details Section First -->
<h2 style="color: #9d0759">Order Summary</h2>

${formatItemSection(items)}

        <table style="width: 100%; font-size: 14px;" cellpadding="0" cellspacing="0">
  <tr>
    <td colspan="2"><hr style="border-top: 1px solid #ccc" /></td>
  </tr>

  <!-- ✅ Show original subtotal if discount exists -->
  <% if (discount > 0) { %>
  <tr>
    <td><strong>Subtotal (before discount):</strong></td>
    <td style="text-align: right"><s>$${(subtotal + discount).toFixed(2)}</s></td>
  </tr>
  <tr>
    <td><strong>Discount (${coupon}):</strong></td>
    <td style="text-align: right; color: green">- $${discount.toFixed(2)}</td>
  </tr>
  <% } %>

  <!-- ✅ Always show discounted subtotal -->
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
<h2 style="color: #9d0759; font-size: 18px; margin-bottom: 6px;">
  Delivery Details
</h2>

<table style="width: 100%; margin-bottom: 10px; font-size: 15px; line-height: 1.6;">
  <tr>
    <td style="padding: 6px 0;">
      📅 <strong>Delivery Date:</strong> ${deliveryDate}
    </td>
  </tr>
  <tr>
    <td style="padding: 6px 0;">
      ⏰ <strong>Delivery Time:</strong> ${deliveryTime}
    </td>
  </tr>
  <tr>
    <td style="padding: 6px 0;">
      📍 <strong>Delivery Address:</strong><br />
      ${deliveryAddress?.street || "N/A"}<br />
      ${deliveryAddress?.city || ""}, ${deliveryAddress?.state || ""} ${deliveryAddress?.zip || ""}
    </td>
  </tr>
</table>


      
<p style="margin-top: 30px; font-size: 0.9em; color: #666; text-align: center;">
  Thank you for ordering from <strong>Rricura Tamales and More</strong>!
</p>

<!-- Links Section -->
<p style="text-align: center; font-size: 0.9em; margin-top: 10px;">
  Visit us: 
  <a href="https://www.rricuratamales.com" 
     style="color: #9d0759; text-decoration: none; font-weight: bold;">www.rricuratamles.com</a>
</p>

<p style="text-align: center; margin-top: 10px;">
  <a href="https://www.facebook.com/profile.php?id=61566890440038" style="margin: 0 8px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" 
         alt="Facebook" width="20" style="vertical-align: middle;" />
  </a>
  <a href="https://www.instagram.com/r_ricura/" style="margin: 0 8px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" 
         alt="Instagram" width="20" style="vertical-align: middle;" />
  </a>
  <a href="https://x.com/Rricuratamales" style="margin: 0 8px; text-decoration: none;">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" 
         alt="Twitter" width="20" style="vertical-align: middle;" />
  </a>
  <a href="https://www.tiktok.com/@rricuratamales?_t=ZP-8y5G5NDSIQw&_r=1" style="margin: 0 8px; text-decoration: none;">
  <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" 
       alt="TikTok" width="24" style="vertical-align: middle;" />
</a>

</p>


      </div>
      `;

    const customerMailOptions = {
      from:  `"Rricura Tamales" <${tenant.EMAIL_USER}>`,
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