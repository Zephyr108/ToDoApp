const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  register,
  login,
  deleteAccount,
  updateAccount
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/delete', auth, deleteAccount);
router.patch('/update', auth, updateAccount);

module.exports = router;