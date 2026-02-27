const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    active: { type: Boolean, default: true },
    image_url: { type: String },

    // Relations
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    
    // History
    price_history: [{ type: Number }],
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);