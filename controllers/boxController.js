const Box = require('../models/Box');

const createBox = async (req, res) => {
  try {
    const box = await Box.create(req.body);
    res.status(201).json({ box });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBoxes = async (req, res) => {
  try {
    const boxes = await Box.find().populate('shopping_center store_history contract_history');
    res.status(200).json({ boxes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBox = async (req, res) => {
  try {
    const box = await Box.findById(req.params.id).populate('shopping_center store_history contract_history');
    if (!box) return res.status(404).json({ message: 'Box not found' });
    res.status(200).json({ box });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBox = async (req, res) => {
  try {
    const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!box) return res.status(404).json({ message: 'Box not found' });
    res.status(200).json({ box });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBox = async (req, res) => {
  try {
    const box = await Box.findByIdAndDelete(req.params.id);
    if (!box) return res.status(404).json({ message: 'Box not found' });
    res.status(200).json({ message: 'Box deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBox, getAllBoxes, getBox, updateBox, deleteBox };
