const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { createStore, getAllStores, getStore, updateStore, deleteStore } = require('../controllers/storeController');

router.get('/', authenticate, getAllStores);
router.get('/:id', authenticate, getStore);
router.post('/', authenticate, createStore);
router.put('/:id', authenticate, updateStore);
router.delete('/:id', authenticate, deleteStore);

module.exports = router;
