const Item = require('../models/Item');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Category = require('../models/Category');
const Store = require('../models/Store');
const Notification = require("../models/Notification");

// Create - owner set from authenticated user (route controls role)
exports.createItem = async (req, res) => {
    try {
        const itemData = {
            ...req.body,
            category: await Category.findById(req.body.category),
            owner: req.user._id,
        };
        const userStore = await req.user.getUserStore();
        if (!userStore) return res.status(400).json({ error: 'User does not have an associated store' });
        itemData.store = userStore._id;

        if (req.file) {
            itemData.image_url = `/uploads/items/${req.file.filename}`;
            itemData.image_url = await compressImage(req, "items");
        }

        
        const item = new Item(itemData);
        const notif = await Notification.send(req.user._id, "Item creation", "Your Item is created.");
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Read all - Tous les utilisateurs authentifiés
exports.getItems = async (req, res) => {
    try {
        let filter = {};
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: 'i' };
        }
        if (req.query.category_id) {
            filter.category_id = req.query.category_id;
        }
        if (req.user.role === 'store') {
            filter.owner = req.user._id;
        }
        const items = await Item.find(filter).populate('owner', 'first_name last_name email').populate('category', 'name').populate('store', 'name');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Read one - Tous les utilisateurs authentifiés
exports.getItemById = async (req, res) => {
    try {
        if (req.user.role === 'store') {
            const item = await Item.findOne({ _id: req.params.id, owner: req.user._id }).populate('owner', 'first_name last_name email').populate('category', 'name').populate('store', 'name');
            if (!item) return res.status(404).json({ error: 'Item not found' });
            return res.status(200).json(item);
        }
        const item = await Item.findById(req.params.id).populate('owner', 'first_name last_name email').populate('category', 'name').populate('store', 'name');
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const compressImage = async (req, dir) => {
  const uploadDir = path.join(__dirname, "../uploads/" + dir);
  const originalPath = req.file.path;
  const compressedPath = path.join(uploadDir, "compressed-" + req.file.filename);

  // Redimensionner et compresser l'image
  await sharp(originalPath)
    .resize({ width: 500, height: 500, fit: 'inside' }) // garde le ratio
    .jpeg({ quality: 80 }) // compresse en JPEG à 80%
    .toFile(compressedPath);

  fs.unlinkSync(originalPath);

  return  `/uploads/${dir}/compressed-${req.file.filename}`;
};

// Update - Seulement le store propriétaire de l'item
exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        var prices = [];
        if (req.body.price !== undefined && Number(req.body.price) !== item.price) {
            prices = item.price_history;
            prices.push(item.price);
        }
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const updateData = { ...req.body };
        if (req.body.price !== undefined) {
            updateData.price_history = prices;
        }
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