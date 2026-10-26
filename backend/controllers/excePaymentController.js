
const tenantConfigs = require("../config/tenantConfigs");
const orderSchema = require("../models/ExceOrder");
const getTenantDB = require("../utils/getTenantDB");
const sendExceVerificationEmail = require("../utils/sendExceVerificationEmail");

// Create Stripe PaymentIntent
const createPaymentIntent = async (req, res) => {
  const { client } = req.params;

  console.log("🎯 EXCE PAYMENT CONTROLLER HIT");
  console.log("👉 Client:", client);
  console.log("📦 Request body:", req.body);

  try {
    const { orderTotal, customerInfo } = req.body || {};

    const tenant = tenantConfigs[client];

    if (!tenant || !tenant.STRIPE_SECRET_KEY) {
      return res.status(400).json({
        message: "Client not recognized or Stripe key missing",
      });
    }

    const numericTotal = Number(orderTotal);

    if (
      orderTotal === undefined ||
      orderTotal === null ||
      orderTotal === "" ||
      !Number.isFinite(numericTotal) ||
      numericTotal <= 0
    ) {
      return res.status(400).json({
        message: "A valid order total is required",
      });
    }

    const amount = Math.round(numericTotal * 100);

    const stripe = require("stripe")(tenant.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      ...(customerInfo?.email
        ? { receipt_email: customerInfo.email }
        : {}),
    });

    console.log("✅ PaymentIntent created:", paymentIntent.id);

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("❌ Create PaymentIntent error:", error.message);

    return res.status(500).json({
      message: "Unable to create payment",
      error: error.message,
    });
  }
};

// Verify successful payment, save order, and send confirmation email
const handlePayment = async (req, res) => {
  const { client } = req.params;
  const { paymentIntentId, orderData } = req.body || {};

  console.log("🎯 EXCE HANDLE PAYMENT HIT");
  console.log("👉 Client:", client);
  console.log("👉 PaymentIntent ID:", paymentIntentId);

  try {
    const tenant = tenantConfigs[client];

    if (!tenant || !tenant.STRIPE_SECRET_KEY) {
      return res.status(400).json({
        message: "Client not recognized or Stripe key missing",
      });
    }

    if (!paymentIntentId || !orderData) {
      return res.status(400).json({
        message: "PaymentIntent ID and order data are required",
      });
    }

    const stripe = require("stripe")(tenant.STRIPE_SECRET_KEY);

    // 1. Verify payment directly with Stripe
    const paymentIntent =
      await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: "Payment has not been completed",
      });
    }

    // 2. Verify the amount and currency
    const expectedAmount = Math.round(
      Number(orderData.orderTotal) * 100
    );

    if (
      !Number.isFinite(expectedAmount) ||
      paymentIntent.amount !== expectedAmount ||
      paymentIntent.currency !== "usd"
    ) {
      return res.status(400).json({
        message: "Payment amount does not match the order total",
      });
    }

    // 3. Connect to the tenant database
    const db = await getTenantDB(client);

    const Order =
      db.models.ExceOrder ||
      db.model("ExceOrder", orderSchema);

    // 4. Save the order after verifying payment
    const newOrder = new Order({
      ...orderData,
      paymentStatus: "paid",
      status: "Pending",
    });

    await newOrder.save();

    console.log("✅ Exce order saved:", newOrder._id);

    // 5. Send the customer confirmation email AFTER saving
    try {
      await sendExceVerificationEmail(
        newOrder.toObject(),
        client
      );

      console.log("✅ Exce verification email process completed");
    } catch (emailError) {
      // Email failure must not undo the successful order
      console.error(
        "❌ Order saved, but confirmation email failed:",
        emailError.message
      );
    }

    // 6. Return successful payment and order response
    return res.status(200).json({
      message: "Payment succeeded and order saved",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error(
      "❌ Exce payment processing error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error while processing payment",
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentIntent,
  handlePayment,
};
