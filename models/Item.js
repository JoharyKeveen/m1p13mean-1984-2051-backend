const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, enum: ['Electronics', 'Clothing', 'Food', 'Books', 'Other'], required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    active: { type: Boolean, default: true },
    price_history: [{ type: Number }]
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);