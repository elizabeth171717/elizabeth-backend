const mongoose = require("mongoose");

const ModifierSchema = new mongoose.Schema({
  id: { type: String, required: true }, // frontend-generated id
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
}, { _id: false });

// ✅ NEW
const DisplaySettingSchema = new mongoose.Schema({
  visible: { type: Boolean, default: true },
  available: { type: Boolean, default: true },
  remaining: { type: Number, default: null },
}, { _id: false });

// ✅ NEW
const ViewSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

const DishSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },

  image: { type: String },

basePrice: {
  type: Number,
  default: null,
},

prices: {
  type: Map,
  of: Number,
  default: {},
},

  // ✅ REPLACED OLD available/visible/remaining
  displaySettings: {
    type: Map,
    of: DisplaySettingSchema,
    default: {},
  },

  tags: { type: [String], default: [] },

  modifiers: [ModifierSchema],

  customProperties: [
    {
      key: { type: String },
      value: { type: String },
    },
  ],

}, { _id: false });

// ✅ ADD THIS AFTER DishSchema EXISTS
DishSchema.pre("validate", function(next) {

  const hasBasePrice =
    this.basePrice !== null &&
    this.basePrice !== undefined;

  const hasViewPrices =
    this.prices &&
    this.prices.size > 0;

  const hasModifierPrices =
    this.modifiers?.some(
      (mod) => mod.price > 0
    );

  if (
    !hasBasePrice &&
    !hasViewPrices &&
    !hasModifierPrices
  ) {
    return next(
      new Error(
        "Dish must have at least one price source."
      )
    );
  }

  next();
});
const GroupSchema = new mongoose.Schema({
  id: { type: String, required: true },
  groupName: { type: String, required: true },
  items: [DishSchema],
}, { _id: false });

const SectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  section: { type: String, required: true },
  items: [DishSchema],
  groups: [GroupSchema],
}, { _id: false });

const anahuacMenuSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    restaurantName: { type: String, required: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // ✅ NEW
    views: [ViewSchema],

    sections: [SectionSchema],
  },
  { timestamps: true }
);

module.exports = anahuacMenuSchema;