const StockMovement = require('../models/StockMovement');
const Store = require('../models/Store');


const createStockMovement = async (req, res) => {
  try {
    const stockMovementData = {
      type: req.body.type,
      quantity: req.body.quantity,
      purchasePrice: req.body.purchasePrice
    };
    if (req.body.item_id) stockMovementData.item = req.body.item_id;
    else return res.status(400).json({ message: 'Item is required' });
    if (req.user.role === 'store') {
      const store = await Store.findOne({ manager: req.user._id });
      if (!store) return res.status(404).json({ message: 'Store not found for this manager' });
      stockMovementData.store = store._id;
    }
    
    const sm = await StockMovement.create(stockMovementData);
    res.status(201).json({ stockMovement: sm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStockMovements = async (req, res) => {
  try {
    if (req.user.role === 'store') {
      const store = await Store.findOne({ manager: req.user._id });
      const list = await StockMovement.find({ store: store?._id }).populate('item store');
      return res.status(200).json({ stockMovements: list });
    }
    const list = await StockMovement.find().populate('item store');
    res.status(200).json({ stockMovements: list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStockMovement = async (req, res) => {
  try {
    const sm = await StockMovement.findById(req.params.id).populate('item store');
    if (!sm) return res.status(404).json({ message: 'StockMovement not found' });
    res.status(200).json({ stockMovement: sm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// type: { type: String, enum: ['input', 'output'], required: true },
// quantity: { type: Number, required: true },
// purchasePrice: { type: Number, required: false },
// movementDate: { type: Date, default: Date.now },

// // Relations
// item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
// store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },

const updateStockMovement = async (req, res) => {
  try {
    const stockMovementData = {
      type: req.body.type,
      quantity: req.body.quantity,
      purchasePrice: req.body.purchasePrice
    };
    if (req.body.item_id) stockMovementData.item = req.body.item_id;
    else return res.status(400).json({ message: 'Item is required' });
    if (req.user.role === 'store') {
      const store = await Store.findOne({ manager: req.user._id });
      if (!store) return res.status(404).json({ message: 'Store not found for this manager' });
      stockMovementData.store = store._id;
    }
    
    const sm = await StockMovement.findByIdAndUpdate(req.params.id, stockMovementData, { new: true });
    if (!sm) return res.status(404).json({ message: 'StockMovement not found' });
    res.status(200).json({ stockMovement: sm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStockMovement = async (req, res) => {
  try {
    const sm = await StockMovement.findByIdAndDelete(req.params.id);
    if (!sm) return res.status(404).json({ message: 'StockMovement not found' });
    res.status(200).json({ message: 'StockMovement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createStockMovement, getAllStockMovements, getStockMovement, updateStockMovement, deleteStockMovement };
