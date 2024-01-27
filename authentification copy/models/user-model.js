const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  phone: { type: String, unique: true, required: true }, // Поле на номер телефона
  activationCode: { type: String }, // Поле для одноразового кода
  isActivated: { type: Boolean, default: false }, // Активен ли аккаунт?
});

module.exports = model ("User", UserSchema)

