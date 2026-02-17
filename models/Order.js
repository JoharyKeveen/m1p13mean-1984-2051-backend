const moongoose = require('mongoose');

const orderSchema = new moongoose.Schema({
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'paid', 'canceled'], default: 'pending' },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    invoice: { type: moongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    order_details: [{ type: moongoose.Schema.Types.ObjectId, ref: 'OrderDetail' }]
}, { timestamps: true });

module.exports = moongoose.model('Order', orderSchema);