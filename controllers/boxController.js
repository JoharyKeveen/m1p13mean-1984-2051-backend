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
    const boxes = await Box.find().populate('shopping_center');
    res.status(200).json({ boxes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBox = async (req, res) => {
  try {
    const box = await Box.findById(req.params.id).populate('shopping_center');
    if (!box) return res.status(404).json({ message: 'Box not found' });
    res.status(200).json({ box });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBox = async (req, res) => {
  try {
    const box = await Box.findById(req.params.id);
    if (!box) {
      return res.status(404).json({ message: "Box not found" });
    }

    // Si le prix change → sauvegarder ancien prix
    if (
      req.body.price !== undefined &&
      Number(req.body.price) !== box.price
    ) {
      box.price_history.push(box.price);
      box.price = req.body.price;
    }

    if (req.body.size !== undefined) {
      box.size = req.body.size;
    }
    if (req.body.status !== undefined) {
      box.status = req.body.status;
    }
    if (req.body.shopping_center !== undefined) {
      box.shopping_center = req.body.shopping_center;
    }

    const updatedBox = await box.save();

    res.status(200).json({ box: updatedBox });

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
