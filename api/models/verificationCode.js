const mongoose = require("mongoose");

const verificationCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120, // Код будет храниться в базе данных в течение 2 минут
  },
});

const VerificationCode = mongoose.model(
  "VerificationCode",
  verificationCodeSchema
);

module.exports = VerificationCode;
