const express = require('express');
const { listUsers, toggleUserRole, deleteUser, usageStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(protect, adminOnly);

router.get('/users', listUsers);
router.patch('/users/:id/role', toggleUserRole);
router.delete('/users/:id', deleteUser);
router.get('/usage', usageStats);

module.exports = router;
