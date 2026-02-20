const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  size: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied'], default: 'available' },
  // Relations
  shopping_center: { type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingCenter', default: null },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', default: null },
  store_history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
  contract_history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }],
  // Historique
  price_history: [Number]
}, { timestamps: true });

module.exports = mongoose.model('Box', boxSchema);
