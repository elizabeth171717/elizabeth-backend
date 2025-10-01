const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema({
  id: { type: String, required: true }, // frontend-generated id
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, // base64 string or URL
});

const SectionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // frontend-generated id
  section: { type: String, required: true },
  items: [DishSchema],
});

const MenuSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, required: true },
    sections: [SectionSchema],
  },
  { timestamps: true }
);


module.exports = MenuSchema;  // ✅ export the schema only
