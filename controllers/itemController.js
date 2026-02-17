const Item = require('../models/Item');

// Create - Seulement un user avec rôle "store"
exports.createItem = async (req, res) => {
    try {
        // Vérifier que l'utilisateur a le rôle "store"
        if (req.user.role !== 'store') {
            return res.status(403).json({ 
                error: 'Seuls les stores peuvent créer des items' 
            });
        }

        const item = new Item({
            ...req.body,
            owner: req.user._id
        });
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

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id, 
            req.body, 
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

        await Item.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};