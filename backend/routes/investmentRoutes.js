const express = require('express');
const { getInvestments, addInvestment, deleteInvestment } = require('../controllers/investmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', getInvestments);
router.post('/', addInvestment);
router.delete('/:id', deleteInvestment);

module.exports = router;
