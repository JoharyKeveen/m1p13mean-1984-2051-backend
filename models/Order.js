const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'paid', 'canceled'], default: 'pending' },
    total: { type: Number, required: true },
    paymentMethod: { type: String },

    // Relations
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Embedded
    items: [
        {
            item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
            quantity: { type: Number, required: true },
            subTotal: { type: Number, required: true }
        }
    ],
    invoice: {
        fileName: String,
        pdf: Buffer,
        date: Date
    }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);