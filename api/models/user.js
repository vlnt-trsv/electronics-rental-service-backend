const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  refreshTokens: [
    {
      type: String,
    },
  ],
  accessToken: {
    type: String,
    default: null,
  },
  firstName: {
    type: String,
    default: "null", // или любое другое значение по умолчанию
  },
  lastName: {
    type: String,
    default: "null",
  },
  patronymic: {
    type: String,
    default: "null",
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
    default: "null",
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
  verificationCode: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
