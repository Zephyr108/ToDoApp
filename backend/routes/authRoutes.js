const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // middleware do autoryzacji

// kontrolery
const {
  register,
  login,
  deleteAccount,
  updateAccount
} = require('../controllers/authController');

// rejestracja
router.post('/register', register);

// logowanie
router.post('/login', login);

// usuwanie konta (wymaga zalogowania)
router.post('/delete', auth, deleteAccount);

// edycja konta (wymaga zalogowania)
router.patch('/update', auth, updateAccount);

// eksport routera
module.exports = router;