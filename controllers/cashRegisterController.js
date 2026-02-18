const CashRegister = require('../models/CashRegister');

const createCashRegister = async (req, res) => {
  try {
    const cr = await CashRegister.create(req.body);
    res.status(201).json({ cashRegister: cr });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCashRegisters = async (req, res) => {
  try {
    const list = await CashRegister.find().populate('store');
    res.status(200).json({ cashRegisters: list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCashRegister = async (req, res) => {
  try {
    const cr = await CashRegister.findById(req.params.id).populate('store');
    if (!cr) return res.status(404).json({ message: 'CashRegister not found' });
    res.status(200).json({ cashRegister: cr });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCashRegister = async (req, res) => {
  try {
    const cr = await CashRegister.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cr) return res.status(404).json({ message: 'CashRegister not found' });
    res.status(200).json({ cashRegister: cr });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCashRegister = async (req, res) => {
  try {
    const cr = await CashRegister.findByIdAndDelete(req.params.id);
    if (!cr) return res.status(404).json({ message: 'CashRegister not found' });
    res.status(200).json({ message: 'CashRegister deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCashRegister, getAllCashRegisters, getCashRegister, updateCashRegister, deleteCashRegister };
