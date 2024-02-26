const mongoose = require("mongoose");
const Device = require("./device");
const User = require("./user");
const Payment = require("./payment");

const rentalSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  device: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    deviceImage: {
      type: String,
      required: true,
    },
  },
  category: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  subscriptionOptions: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Выберите опцию"],
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["Не оплачено", "Оплачено", "Завершено", "В аренде"],
    default: "Не оплачено",
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: false,
  },
  endDate: {
    type: Date,
    required: false,
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: false,
  },
});

module.exports = mongoose.model("Rental", rentalSchema);
