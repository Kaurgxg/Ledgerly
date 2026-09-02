const express = require('express');
const { getFeedback, submitFeedback, replyFeedback, reopenFeedback } = require('../controllers/feedbackController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', getFeedback);
router.post('/', submitFeedback);
router.patch('/:id/reply', adminOnly, replyFeedback);
router.patch('/:id/reopen', adminOnly, reopenFeedback);

module.exports = router;
