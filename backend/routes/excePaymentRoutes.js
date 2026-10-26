const express = require("express");

const {
  createPaymentIntent,
  handlePayment,
} = require("../controllers/excePaymentController");

const router = express.Router();

// Create Stripe PaymentIntent
// POST /api/:client/create-payment-intent
router.post("/exce/:client/create-payment-intent", createPaymentIntent);

// Verify Stripe payment and save order
// POST /api/:client/payment
router.post("/exce/:client/payment", handlePayment);

module.exports = router;