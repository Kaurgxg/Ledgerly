const express = require('express');
const { monthlyReport, platformReport } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/monthly', monthlyReport);
router.get('/platform', adminOnly, platformReport);

module.exports = router;
