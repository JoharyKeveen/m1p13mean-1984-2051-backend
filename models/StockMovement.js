const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
    type: { type: String, enum: ['input', 'output'], required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    movementDate: { type: Date, default: Date.now },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

module.exports = mongoose.model('StockMovement', stockMovementSchema);

// -_id string [pk]-type string // input / output-quantity int-purchasePrice float-movementDate date
// -orders Order[]