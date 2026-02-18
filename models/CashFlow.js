const mongoose = require('mongoose');

const cashFlowSchema = new mongoose.Schema({
  type: { type: String, enum: ['input','output'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },

  // Relations
  cash_register: { type: mongoose.Schema.Types.ObjectId, ref: 'CashRegister' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }
}, { timestamps: true });

module.exports = mongoose.model('CashFlow', cashFlowSchema);
