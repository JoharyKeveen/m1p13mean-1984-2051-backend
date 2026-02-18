const mongoose = require('mongoose');

const shoppingCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ShoppingCenter', shoppingCenterSchema);