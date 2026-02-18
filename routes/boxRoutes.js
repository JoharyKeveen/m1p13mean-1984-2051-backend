const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { createBox, getAllBoxes, getBox, updateBox, deleteBox } = require('../controllers/boxController');

router.get('/', authenticate, getAllBoxes);
router.get('/:id', authenticate, getBox);
router.post('/', authenticate, createBox);
router.put('/:id', authenticate, updateBox);
router.delete('/:id', authenticate, deleteBox);

module.exports = router;
