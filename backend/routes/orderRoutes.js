const express = require("express");
const router = express.Router();
const orderSchema = require("../models/Order");
const getTenantDB = require("../utils/getTenantDB");

router.get("/:client/orders", async (req, res) => {
  const { client } = req.params;
  
  const { name, email, orderNumber } = req.query;


  const filters = {};

  if (name) {
    
    filters.customerName = { $regex: name, $options: "i" };

  }

  

if (email) {
  filters["customerInfo.email"] = email; // ← exact match
}

    if (orderNumber) {
  filters.orderNumber = orderNumber; // ← exact match
}

  

  try {
    const db = await getTenantDB(client);
    const Order = db.model("Order", orderSchema);

    const orders = await Order.find(filters).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

router.patch("/:client/orders/:id/status", async (req, res) => {
  const { client, id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required." });
  }

  try {
    const db = await getTenantDB(client);
    const Order = db.model("Order", orderSchema);

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
});



module.exports = router;
