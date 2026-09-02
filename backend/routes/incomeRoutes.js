const express = require('express');
const { getIncome, addIncome, deleteIncome } = require('../controllers/incomeController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', getIncome);
router.post('/', addIncome);
router.delete('/:id', deleteIncome);

module.exports = router;
