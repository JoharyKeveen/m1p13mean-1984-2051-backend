const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { createShoppingCenter, getAllShoppingCenters, getShoppingCenter, updateShoppingCenter, deleteShoppingCenter } = require('../controllers/shoppingCenterController');

router.get('/', authenticate, getAllShoppingCenters);
router.get('/:id', authenticate, getShoppingCenter);
router.post('/', authenticate, createShoppingCenter);
router.put('/:id', authenticate, updateShoppingCenter);
router.delete('/:id', authenticate, deleteShoppingCenter);

module.exports = router;
