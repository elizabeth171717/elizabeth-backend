const mongoose = require("mongoose");

const ModifierSchema = new mongoose.Schema({
  id: { type: String, required: true }, // frontend-generated id
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
}, { _id: false }); // _id: false to prevent automatic _id generation for modifiers

const DishSchema = new mongoose.Schema({
  id: { type: String, required: true }, // frontend-generated id
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, // base64 string or URL
  available: { type: Boolean, default: true },
  visible: { type: Boolean, default: true },
  modifiers: [ModifierSchema],
  customProperties: [
  {
    key: { type: String },
    value: { type: String },
  },
],

}, { _id: false }); // _id: false to prevent automatic _id generation for dishes

const GroupSchema = new mongoose.Schema({
  id: { type: String, required: true }, // frontend-generated id
  groupName: { type: String, required: true },
  items: [DishSchema],
}, { _id: false }); // _id: false to prevent automatic _id generation for groups

const SectionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // frontend-generated id
  section: { type: String, required: true },
  items: [DishSchema],      // ungrouped items
  groups: [GroupSchema],    // new: groups within the section
}, { _id: false }); // _id: false to prevent automatic _id generation for sections

const anahuacMenuSchema = new mongoose.Schema(
{
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true, // optional but recommended for fast lookups
    },

    restaurantName: { type: String, required: true },
    sections: [SectionSchema],
  },
  { timestamps: true }
);

module.exports = anahuacMenuSchema;