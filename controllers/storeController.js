const Store = require('../models/Store');

const createStore = async (req, res) => {
  try {
    const storeData = {
      name: req.body.name,
      description: req.body.description,
      manager: req.body.manager
    };
    const store = await Store.create(storeData);
    res.status(201).json({ store });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStores = async (req, res) => {
  try {
    if (req.user.role === 'store') {
      const store = await Store.findOne({ manager: req.user._id }).populate('manager');
      return res.status(200).json({ stores: [store] });
    }
    const stores = await Store.find().populate('manager');
    res.status(200).json({ stores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStore = async (req, res) => {
  try {
    if (req.user.role === 'store') {
      const store = await Store.findOne({ _id: req.params.id, manager: req.user._id }).populate('manager');
      return res.status(200).json({ store });
    }
    const store = await Store.findById(req.params.id).populate('manager');
    res.status(200).json({ store });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.status(200).json({ store });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.status(200).json({ message: 'Store deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createStore, getAllStores, getStore, updateStore, deleteStore };
