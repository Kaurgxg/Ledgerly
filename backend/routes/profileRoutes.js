const express = require('express');
const { updateProfile, changePassword, deleteOwnAccount } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.put('/', updateProfile);
router.put('/password', changePassword);
router.delete('/', deleteOwnAccount);

module.exports = router;
