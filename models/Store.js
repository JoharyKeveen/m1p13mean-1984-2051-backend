const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  stock: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock'
    }
  ],

  cash_registers: { type: mongoose.Schema.Types.ObjectId, ref: 'CashRegister' }

}, { timestamps: true });

module.exports = mongoose.model('Store', StoreSchema);