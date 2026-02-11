const mongoose = require('mongoose');

const ShoppingCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  boxes: [ 
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Box'
    } 
  ]
}, { timestamps: true });

module.exports = mongoose.model('ShoppingCenter', ShoppingCenterSchema);