const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const { createShoppingCenter, getAllShoppingCenters, getShoppingCenter, updateShoppingCenter, deleteShoppingCenter, getSingleShoppingCenter } = require('../controllers/shoppingCenterController');

router.get('/', authenticate, authorizeRoles('admin'), getAllShoppingCenters);
router.get('/single', authenticate, authorizeRoles('store'), getSingleShoppingCenter);  
router.post('/', authenticate, authorizeRoles('admin'), createShoppingCenter);
router.put('/:id', authenticate, authorizeRoles('admin'), updateShoppingCenter);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteShoppingCenter);

module.exports = router;