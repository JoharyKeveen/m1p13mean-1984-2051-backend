const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { createOrder, getAllOrders, getOrder, updateOrder, deleteOrder } = require('../controllers/orderController');

router.get('/', authenticate, getAllOrders);
router.get('/:id', authenticate, getOrder);
router.post('/', authenticate, createOrder);
router.put('/:id', authenticate, updateOrder);
router.delete('/:id', authenticate, deleteOrder);

module.exports = router;
