const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true }, // Add orderNumber here
  tamales: [
    {
      name: { type: String, required: true }, // Tamale name (e.g., "Chicken Tamales")
      quantity: { type: Number, required: true }, // Quantity of that tamale
    }
  ],

  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  total: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: false },
  deliveryDate: { type: String, required: true }, // Store as a string to match `toDateString()`
  deliveryTime: { type: String, required: true },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically stores the order submission date
  }
});

module.exports = orderSchema; // ✅ export only the schema