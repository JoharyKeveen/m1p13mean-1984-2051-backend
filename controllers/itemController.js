const Item = require('../models/Item');
const path = require('path');
const fs = require('fs');

// Create - Seulement un user avec rôle "store"
exports.createItem = async (req, res) => {
    try {
        // Vérifier que l'utilisateur a le rôle "store"
        if (req.user.role !== 'store') {
            return res.status(403).json({ 
                error: 'Seuls les stores peuvent créer des items' 
            });
        }

        const itemData = {
            ...req.body,
            owner: req.user._id
        };

        console.log('Received item data:', req.file);

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
        const items = await Item.find().populate('owner', 'first_name last_name email');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Read one - Tous les utilisateurs authentifiés
exports.getItemById = async (req, res) => {
    try {
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
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Vérifier que l'utilisateur est le propriétaire ET a le rôle "store"
        if (item.owner.toString() !== req.user._id.toString() || req.user.role !== 'store') {
            return res.status(403).json({ 
                error: 'Vous pouvez uniquement modifier vos propres items' 
            });
        }

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
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Vérifier que l'utilisateur est le propriétaire ET a le rôle "store"
        if (item.owner.toString() !== req.user._id.toString() || req.user.role !== 'store') {
            return res.status(403).json({ 
                error: 'Vous pouvez uniquement supprimer vos propres items' 
            });
        }

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