const StockMovement = require('../models/StockMovement');
const Store = require('../models/Store');
const Item = require('../models/Item');

const createStockMovement = async (req, res) => {
  try {
    const stockMovementData = {
      type: req.body.type,
      quantity: req.body.quantity,
      purchasePrice: req.body.purchasePrice
    };
    if (req.body.item_id){
      stockMovementData.item = req.body.item_id;
    } else return res.status(400).json({ message: 'Item is required' });
    if (req.user.role === 'store') {
      const store = await Store.findOne({ manager: req.user._id });
      if (!store) return res.status(404).json({ message: 'Store not found for this manager' });
      stockMovementData.store = store._id;
    }

    const item = await Item.findById(stockMovementData.item);

    const sm = await StockMovement.create(stockMovementData);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Selon le type du mouvement
    if (stockMovementData.type === 'input') {
      item.quantity += stockMovementData.quantity; 
    } else if (stockMovementData.type === 'output') {
      item.quantity -= stockMovementData.quantity; 
      if (item.quantity < 0) item.quantity = 0;      
    }

    await item.save();
    
    res.status(201).json({ stockMovement: sm, item: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStockMovements = async (req, res) => {
  try {
    let filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.item_id) {
      filter.item = req.query.item_id;
    }

    if (req.user.role === 'store') {
      const store = await Store.findOne({ manager: req.user._id });
      if (!store) {
        return res.status(404).json({ message: 'Store not found for this manager' });
      }
      filter.store = store._id;
    }

    const list = await StockMovement
      .find(filter)
      .populate('item store');

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

    const item = await Item.findById(stockMovementData.item);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    const sm = await StockMovement.findByIdAndUpdate(req.params.id, stockMovementData, { new: true });
    if (!sm) return res.status(404).json({ message: 'StockMovement not found' });

    // Selon le type du mouvement
    if (stockMovementData.type === 'input') {
      item.quantity += stockMovementData.quantity; 
    } else if (stockMovementData.type === 'output') {
      item.quantity -= stockMovementData.quantity; 
      if (item.quantity < 0) item.quantity = 0;      
    }

    await item.save();

    res.status(200).json({ stockMovement: sm, item: item });
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
