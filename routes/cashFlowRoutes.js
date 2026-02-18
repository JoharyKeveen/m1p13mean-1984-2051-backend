const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { createCashFlow, getAllCashFlows, getCashFlow, updateCashFlow, deleteCashFlow } = require('../controllers/cashFlowController');

router.get('/', authenticate, getAllCashFlows);
router.get('/:id', authenticate, getCashFlow);
router.post('/', authenticate, createCashFlow);
router.put('/:id', authenticate, updateCashFlow);
router.delete('/:id', authenticate, deleteCashFlow);

module.exports = router;
