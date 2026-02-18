const CashFlow = require('../models/CashFlow');

const createCashFlow = async (req, res) => {
  try {
    const cf = await CashFlow.create(req.body);
    res.status(201).json({ cashFlow: cf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCashFlows = async (req, res) => {
  try {
    const list = await CashFlow.find().populate('cash_register order');
    res.status(200).json({ cashFlows: list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCashFlow = async (req, res) => {
  try {
    const cf = await CashFlow.findById(req.params.id).populate('cash_register order');
    if (!cf) return res.status(404).json({ message: 'CashFlow not found' });
    res.status(200).json({ cashFlow: cf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCashFlow = async (req, res) => {
  try {
    const cf = await CashFlow.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cf) return res.status(404).json({ message: 'CashFlow not found' });
    res.status(200).json({ cashFlow: cf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCashFlow = async (req, res) => {
  try {
    const cf = await CashFlow.findByIdAndDelete(req.params.id);
    if (!cf) return res.status(404).json({ message: 'CashFlow not found' });
    res.status(200).json({ message: 'CashFlow deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCashFlow, getAllCashFlows, getCashFlow, updateCashFlow, deleteCashFlow };
