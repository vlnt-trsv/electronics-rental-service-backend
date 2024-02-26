const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
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
