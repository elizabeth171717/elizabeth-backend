
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

    image: {
      type: String,
    },

    img: {
      type: String,
    },

    designUrl: {
      type: String,
    },

    designFileName: {
      type: String,
    },

    designType: {
      type: String,
    },

    customProperties: [
      {
        key: String,
        value: String,
      },
    ],
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Products in the cart
    items: {
      type: [itemSchema],
      required: true,
    },

    fulfillment: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },

    deliveryAddress: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

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

    shirtQuantity: {
      type: Number,
      default: 0,
    },

    shirtDiscount: {
      type: Number,
      default: 0,
    },

    discountedItemsTotal: {
      type: Number,
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

    paymentStatus: {
      type: String,
      default: "pending",
    },

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
