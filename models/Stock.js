const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true },
    type_stock: { type: String, enum: ['FIFO', 'LIFO'], required: true },
    stock_movements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StockMovement' }]
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);    