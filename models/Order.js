const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'paid', 'canceled'], default: 'pending' },
    total: { type: Number, required: true },
    paymentMethod: { type: String },

    // Relations
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    
    // Embedded
    items: [
        {
            item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
            name: { type: String },
            quantity: { type: Number, required: true },
            unitPrice: { type: Number, required: true },
            subTotal: { type: Number, required: true }
        }
    ],
    invoice: {
        file: { type: String },
        date: { type: Date }
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);