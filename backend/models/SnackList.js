// models/SnackList.js

const mongoose = require("mongoose");

const RowSchema = new mongoose.Schema(
  {
    parent: String,
    student: String,
   
    date: {
  type: String,
  required: true,
},
    status: {
      type: String,
      default: "Upcoming",
    },
    email: String,
  }
);

const SnackListSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SnackUser",
      required: true,
    },

    // Name of the snack list (ex. "Children Orchestra")
    listName: {
      type: String,
      required: true,
    },

    slug: {
  type: String,
  unique: true,
  required: true,
},

    


    rows: [RowSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = SnackListSchema;