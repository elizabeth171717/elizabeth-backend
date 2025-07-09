const tenantConfigs = require("../config/tenantConfigs");
const orderSchema = require("../models/Order"); // ✅ import only schema
const getTenantDB = require("../utils/getTenantDB"); // ✅ dynamic connector
const sendEmail = require("../utils/sendEmail");


// Create PaymentIntent with tenant Stripe key
const createPaymentIntent = async (req, res) => {
   console.log("🎯 createPaymentIntent HIT", req.params.client); // Add this
  const { client } = req.params;
  const { total, customerEmail } = req.body;
console.log("💡 Incoming client:", client);
console.log("👉 client:", client);
  console.log("👉 total:", total);
  console.log("👉 customerEmail:", customerEmail);
console.log("💡 Full tenantConfigs:", tenantConfigs);
  const tenant = tenantConfigs[client];
console.log("🔐 Stripe Secret Key for", client, ":", tenant?.STRIPE_SECRET_KEY);

  if (!tenant || !tenant.STRIPE_SECRET_KEY) {
    return res.status(400).json({ message: "Client or Stripe key not recognized" });
  }

  const stripe = require("stripe")(tenant.STRIPE_SECRET_KEY);
  


  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      receipt_email: customerEmail,
    });

    return res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Payment Intent Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle post-payment order saving and email sending
const handlePayment = async (req, res) => {
  const { client } = req.params;
  const { paymentIntentId, orderData } = req.body;

  const tenant = tenantConfigs[client];

  if (!tenant || !tenant.STRIPE_SECRET_KEY) {
    return res.status(400).json({ message: 'Client not recognized or missing Stripe key' });
  }

  const stripe = require("stripe")(tenant.STRIPE_SECRET_KEY);

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      console.log(`✅ Payment succeeded for order ${orderData.orderNumber}`);

      const db = await getTenantDB(client); // ✅ correct tenant DB
     
      const Order = db.models.Order || db.model('Order', orderSchema);

      const newOrder = new Order(orderData);
      await newOrder.save();

      await sendEmail(
        orderData.customerEmail,
        orderData.customerName,
        orderData,
        client // sendEmail will use tenantConfigs inside
      );

      return res.status(200).json({ message: 'Payment succeeded and email sent' });
    } else {
      return res.status(400).json({ message: 'Payment not completed yet' });
    }
  } catch (error) {
    console.error("❌ Error in handlePayment:", error);
    res.status(500).json({ message: 'Server error during post-payment processing' });
  }
};

module.exports = { createPaymentIntent, handlePayment };