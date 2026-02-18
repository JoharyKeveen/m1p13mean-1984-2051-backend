const mongoose = require('mongoose');

const cashRegisterSchema = new mongoose.Schema({
    amount: { type: Number, default: 0 },

    // Relations
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }
}, { timestamps: true });

module.exports = mongoose.model('CashRegister', cashRegisterSchema);
