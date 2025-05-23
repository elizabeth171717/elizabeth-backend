
// routes/paymentRoutes.js
const express = require("express");
const { createPaymentIntent, handlePayment } = require("../controllers/paymentController");

const router = express.Router({ mergeParams: true });

// POST /api/:client/create-payment-intent → mapped to createPaymentIntent
router.post("/:client/create-payment-intent", createPaymentIntent);

// POST /api/:client/payment → mapped to handlePayment
router.post("/:client/payment", handlePayment);

module.exports = router;
