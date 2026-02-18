const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { createCashRegister, getAllCashRegisters, getCashRegister, updateCashRegister, deleteCashRegister } = require('../controllers/cashRegisterController');

router.get('/', authenticate, getAllCashRegisters);
router.get('/:id', authenticate, getCashRegister);
router.post('/', authenticate, createCashRegister);
router.put('/:id', authenticate, updateCashRegister);
router.delete('/:id', authenticate, deleteCashRegister);

module.exports = router;
