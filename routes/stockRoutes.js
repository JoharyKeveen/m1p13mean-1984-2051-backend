const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const { createStock, getAllStocks, getStock, updateStock, deleteStock } = require('../controllers/stockController');

router.get('/', authenticate, getAllStocks);
router.get('/:id', authenticate, getStock);
router.post('/', authenticate, authorizeRoles('store','admin'), createStock);
router.put('/:id', authenticate, authorizeRoles('store','admin'), updateStock);
router.delete('/:id', authenticate, authorizeRoles('store','admin'), deleteStock);

module.exports = router;
