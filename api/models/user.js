const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  role: {
    type: String,
    enum: ["User", "Editor", "Admin"],
    default: "User",
  },
  // refreshTokens: [
  //   {
  //     type: String,
  //   },
  // ],
  // accessToken: {
  //   type: String,
  //   default: null,
  // },
  firstName: {
    type: String,
    default: "null",
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
});

module.exports = mongoose.model("User", userSchema);
