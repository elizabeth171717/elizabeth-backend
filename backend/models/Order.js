const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  basePrice: { type: Number, required: true },
  unit: { type: String },        // Optional (e.g. "dozen", "x", "large")
  size: { type: String },        // Optional for sides like "Small", "Large"
  category: { type: String },    // Optional if you want to know: tamale, drink, etc.
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  items: [itemSchema], 
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  tip: { type: Number, required: false },
  total: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: false },
  deliveryDate: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  deliveryAddress: {
    street: { type: String, required: true },
    apt: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    instructions: { type: String },
    fullAddress: { type: String },
    distanceMiles: { type: Number },
    fee: { type: Number, required: true }, // ✅ moved here
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = orderSchema;
