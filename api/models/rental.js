const mongoose = require("mongoose");

const rentalSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Rental", rentalSchema);
