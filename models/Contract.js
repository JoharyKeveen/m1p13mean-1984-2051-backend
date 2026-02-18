const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  file_url: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'unpaid'], default: 'pending' }
  
  //Relations
  box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);
