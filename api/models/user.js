const mongoose = require("mongoose");
const Payment = require("../models/payment");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  role: {
    type: String,
    enum: ["User", "Editor", "Admin"],
    default: "User",
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  patronymic: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  phone: {
    type: String,
    default: "",
  },
  consentToPrivacyPolicy: {
    type: Boolean,
    default: false,
  },
  consentToDataProcessing: {
    type: Boolean,
    default: false,
  },
  consentToReceiveNotifications: {
    type: Boolean,
    default: false,
  },
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment"
  }]
});

module.exports = mongoose.model("User", userSchema);
