const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const { 
    createItem, 
    getItems, 
    getItemById, 
    updateItem, 
    deleteItem 
} = require('../controllers/itemController');

// Toutes les routes nécessitent une authentification
// READ - Tous les utilisateurs authentifiés peuvent voir les items
router.get('/', authenticate, getItems);
router.get('/:id', authenticate, getItemById);

// CREATE - Seulement les stores
router.post('/', authenticate, createItem);

// UPDATE - Seulement le store propriétaire (vérifié dans le contrôleur)
router.put('/:id', authenticate, updateItem);

// DELETE - Seulement le store propriétaire (vérifié dans le contrôleur)
router.delete('/:id', authenticate, deleteItem);

module.exports = router;