const express = require('express');
const { getHabits, addHabit, toggleHabit, deleteHabit } = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', getHabits);
router.post('/', addHabit);
router.patch('/:id/toggle', toggleHabit);
router.delete('/:id', deleteHabit);

module.exports = router;
