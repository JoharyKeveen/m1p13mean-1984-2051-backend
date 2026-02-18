const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { createCategory, getAllCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.get('/', authenticate, getAllCategories);
router.get('/:id', authenticate, getCategory);
router.post('/', authenticate, createCategory);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

module.exports = router;
