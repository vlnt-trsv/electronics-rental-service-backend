const mongoose = require("mongoose");
const User = require("./user");

const paymentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rental",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Не оплачено", "Оплачено", "Возврат", "Ошибка"],
    default: "Не оплачено",
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
