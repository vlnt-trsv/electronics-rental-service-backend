const mongoose = require("mongoose");
const Device = require("./device");
const User = require("./user");
const Payment = require("./payment");

const rentalSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  device: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: [true, "Выберите девайса"],
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
  deliveryMethod: {
    type: String,
    enum: ["Доставка", "Самовывоз"],
    required: [true, "Выберите способ доставки"],
  },
  deliveryCost: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Не оплачено", "Оплачено", "Завершено", "В аренде", "Отменено"],
    default: "Не оплачено",
  },
  rentalDate: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
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

rentalSchema.pre('save', function(next) {
  if (this.deliveryMethod === "Доставка") {
    this.deliveryCost = 240;
  } else {
    this.deliveryCost = 0;
  }
  next();
});

module.exports = mongoose.model("Rental", rentalSchema);
