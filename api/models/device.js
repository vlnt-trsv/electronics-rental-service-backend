const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },  
  deviceImage: { type: String },
});

module.exports = mongoose.model("Device", deviceSchema);
