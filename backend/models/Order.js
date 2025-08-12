const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  // Match frontend's cartItems exactly
  name: { type: String }, // For non-tamale items like "Green Sauce"
  filling: { type: String }, // For tamales
  wrapper: { type: String },
  sauce: { type: String },
  vegOil: { type: Boolean },
  fruit: { type: Boolean },
  size: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  img: { type: String },
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
   // ✅ Add this:
    status: {
      type: String,
      default: "Pending",
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = orderSchema;