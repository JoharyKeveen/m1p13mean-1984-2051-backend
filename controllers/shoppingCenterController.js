const ShoppingCenter = require('../models/ShoppingCenter');

const createShoppingCenter = async (req, res) => {
  try {
    const sc = await ShoppingCenter.create(req.body);
    res.status(201).json({ shoppingCenter: sc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllShoppingCenters = async (req, res) => {
  try {
    const list = await ShoppingCenter.find().populate('boxes stores');
    res.status(200).json({ shoppingCenters: list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShoppingCenter = async (req, res) => {
  try {
    const sc = await ShoppingCenter.findById(req.params.id).populate('boxes stores');
    if (!sc) return res.status(404).json({ message: 'ShoppingCenter not found' });
    res.status(200).json({ shoppingCenter: sc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateShoppingCenter = async (req, res) => {
  try {
    const sc = await ShoppingCenter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sc) return res.status(404).json({ message: 'ShoppingCenter not found' });
    res.status(200).json({ shoppingCenter: sc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteShoppingCenter = async (req, res) => {
  try {
    const sc = await ShoppingCenter.findByIdAndDelete(req.params.id);
    if (!sc) return res.status(404).json({ message: 'ShoppingCenter not found' });
    res.status(200).json({ message: 'ShoppingCenter deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createShoppingCenter, getAllShoppingCenters, getShoppingCenter, updateShoppingCenter, deleteShoppingCenter };
