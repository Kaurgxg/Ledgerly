const express = require('express');
const { getGoals, addGoal, contribute, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', getGoals);
router.post('/', addGoal);
router.post('/:id/contribute', contribute);
router.delete('/:id', deleteGoal);

module.exports = router;
