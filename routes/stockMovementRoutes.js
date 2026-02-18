const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { createStockMovement, getAllStockMovements, getStockMovement, updateStockMovement, deleteStockMovement } = require('../controllers/stockMovementController');

router.get('/', authenticate, getAllStockMovements);
router.get('/:id', authenticate, getStockMovement);
router.post('/', authenticate, createStockMovement);
router.put('/:id', authenticate, updateStockMovement);
router.delete('/:id', authenticate, deleteStockMovement);

module.exports = router;
