// routes/deliveryFeeRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const { calculateDeliveryFee } = require("../controllers/deliveryFeeController");

// Matches: /api/:client/delivery-fee
router.post("/:client/delivery-fee", calculateDeliveryFee);

module.exports = router;
