const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { createOrder, getAllOrders, getOrder, updateOrder, deleteOrder, addToCart, removeItemsFromCart, checkout, downloadInvoice } = require('../controllers/orderController');

router.get('/', authenticate, getAllOrders);
router.get('/:id', authenticate, getOrder);
router.post('/', authenticate, createOrder);
router.put('/:id', authenticate, updateOrder);
router.delete('/:id', authenticate, deleteOrder);
router.post("/cart/add", authenticate, addToCart);
router.post("/cart/remove", authenticate, removeItemsFromCart);
router.post("/checkout", authenticate, checkout);
router.get("/invoice/:id",authenticate,downloadInvoice);

module.exports = router;
