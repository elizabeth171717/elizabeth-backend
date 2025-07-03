
const express = require("express");
const router = express.Router();
const orderSchema = require("../models/Order");
const getTenantDB = require("../utils/getTenantDB");

router.get("/:client/orders", async (req, res) => {
  const { client } = req.params;

  try {
    const db = await getTenantDB(client);
    const Order = db.model("Order", orderSchema);

    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
