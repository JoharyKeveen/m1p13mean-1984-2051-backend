const Item = require('../models/Item');
const path = require('path');
const fs = require('fs');
const Category = require('../models/Category');
const Store = require('../models/Store');

// Create - owner set from authenticated user (route controls role)
exports.createItem = async (req, res) => {
    try {
        const itemData = {
            ...req.body,
            category: await Category.findById(req.body.category),
            store: await Store.findById(req.body.store),
            owner: req.user._id,
        };

        if (req.file) {
            itemData.image_url = `/uploads/items/${req.file.filename}`;
        }

        const item = new Item(itemData);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Read all - Tous les utilisateurs authentifiés
exports.getItems = async (req, res) => {
    try {
        if (req.user.role === 'store') {
            const items = await Item.find({ owner: req.user._id }).populate('owner', 'first_name last_name email');
            return res.status(200).json(items);
        }
        const items = await Item.find().populate('owner', 'first_name last_name email');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Read one - Tous les utilisateurs authentifiés
exports.getItemById = async (req, res) => {
    try {
        if (req.user.role === 'store') {
            const item = await Item.findOne({ _id: req.params.id, owner: req.user._id }).populate('owner', 'first_name last_name email');
            if (!item) return res.status(404).json({ error: 'Item not found' });
            return res.status(200).json(item);
        }
        const item = await Item.findById(req.params.id).populate('owner', 'first_name last_name email');
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update - Seulement le store propriétaire de l'item
exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const updateData = { ...req.body };
        if (req.file) {
            // Supprimer l'ancien fichier s'il existe
            if (item.image_url) {
                const oldFilePath = path.join(__dirname, '..', item.image_url);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            updateData.image_url = `/uploads/items/${req.file.filename}`;
        }

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete - Seulement le store propriétaire de l'item
exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        // Supprimer le fichier image s'il existe
        if (item.image_url) {
            const filePath = path.join(__dirname, '..', item.image_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Item.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};