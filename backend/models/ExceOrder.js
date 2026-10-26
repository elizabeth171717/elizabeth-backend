const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
    },

    color: {
      type: String,
    },

    size: {
      type: String,
    },

    quantity: {
      type: Number,
      required: true,
    },

    img: {
      type: String,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // The products that were in the cart
    items: {
      type: [itemSchema],
      required: true,
    },

    // pickup or delivery
    fulfillment: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },

    // Only used when fulfillment === "delivery"
    deliveryAddress: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Customer information
    customerInfo: {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },
    },

    // Money
    itemsTotal: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      required: true,
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    orderTotal: {
      type: Number,
      required: true,
    },

    // Payment information will be added when you connect Stripe
    paymentStatus: {
      type: String,
      default: "pending",
    },

    // Order status
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = orderSchema;