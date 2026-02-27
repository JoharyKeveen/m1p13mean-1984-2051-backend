const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  size: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied'], default: 'available' },
  // Relations
  shopping_center: { type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingCenter', default: null },
  // Historique
  price_history: [Number]
}, { timestamps: true });

module.exports = mongoose.model('Box', boxSchema);







