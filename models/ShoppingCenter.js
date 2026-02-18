const mongoose = require('mongoose');

const ShoppingCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ShoppingCenter', ShoppingCenterSchema);