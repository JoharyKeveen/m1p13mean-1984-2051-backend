const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const { createStore, getAllStores, getStore, updateStore, deleteStore } = require('../controllers/storeController');

router.get('/', authenticate, authorizeRoles('admin','store'), getAllStores);
router.get('/:id', authenticate, authorizeRoles('admin'), getStore);
router.post('/', authenticate, authorizeRoles('admin'), createStore);
router.put('/:id', authenticate, authorizeRoles('admin','store'), updateStore);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteStore);

module.exports = router;
