const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const { createBox, getAllBoxes, getBox, updateBox, deleteBox } = require('../controllers/boxController');

router.get('/', authenticate, authorizeRoles('store','admin'), getAllBoxes);
router.get('/:id', authenticate, authorizeRoles('store','admin'), getBox);
router.post('/', authenticate, authorizeRoles('store','admin'), createBox);
router.put('/:id', authenticate, authorizeRoles('store','admin'), updateBox);
router.delete('/:id', authenticate, authorizeRoles('store','admin'), deleteBox);

module.exports = router;
