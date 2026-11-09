const express = require("express");

const {
  createPaymentIntent,
  handlePayment,
  getExceOrders,
  updateExceOrderStatus,
} = require("../controllers/excePaymentController");

const router = express.Router();

// Create Stripe PaymentIntent
// POST /api/:client/create-payment-intent
router.post("/exce/:client/create-payment-intent", createPaymentIntent);

// Verify Stripe payment and save order
// POST /api/:client/payment
router.post("/exce/:client/payment", handlePayment);

// Get all Exce orders
router.get("/exce/:client/orders", getExceOrders);

// Update Exce order status
router.patch("/exce/:client/orders/:orderId", updateExceOrderStatus);

module.exports = router;