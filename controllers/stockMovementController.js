const StockMovement = require('../models/StockMovement');

const createStockMovement = async (req, res) => {
  try {
    const sm = await StockMovement.create(req.body);
    res.status(201).json({ stockMovement: sm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStockMovements = async (req, res) => {
  try {
    const list = await StockMovement.find().populate('item store orders');
    res.status(200).json({ stockMovements: list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStockMovement = async (req, res) => {
  try {
    const sm = await StockMovement.findById(req.params.id).populate('item store orders');
    if (!sm) return res.status(404).json({ message: 'StockMovement not found' });
    res.status(200).json({ stockMovement: sm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStockMovement = async (req, res) => {
  try {
    const sm = await StockMovement.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
