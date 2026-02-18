const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { createStock, getAllStocks, getStock, updateStock, deleteStock } = require('../controllers/stockController');

router.get('/', authenticate, getAllStocks);
router.get('/:id', authenticate, getStock);
router.post('/', authenticate, createStock);
router.put('/:id', authenticate, updateStock);
router.delete('/:id', authenticate, deleteStock);

module.exports = router;
