const mongoose = require("mongoose");
const Category = require("../models/сategory");

const subscriptionOptionSchema = mongoose.Schema({
  type: mongoose.Schema.Types.ObjectId,
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
});

const deviceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  deviceImage: { type: String },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subscriptionOptions: [subscriptionOptionSchema],
});

module.exports = mongoose.model("Device", deviceSchema);
