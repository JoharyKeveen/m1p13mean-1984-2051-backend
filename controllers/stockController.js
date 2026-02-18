const Stock = require('../models/Stock');

const createStock = async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json({ stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().populate('item store stock_movements');
    res.status(200).json({ stocks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id).populate('item store stock_movements');
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.status(200).json({ stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.status(200).json({ stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.status(200).json({ message: 'Stock deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createStock, getAllStocks, getStock, updateStock, deleteStock };
