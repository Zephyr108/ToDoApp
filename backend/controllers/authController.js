const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// REJESTRACJA
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ username, password });
    await user.save();

    res.status(201).json({ msg: 'User created' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// PATCH /api/auth/update - aktualizacja loginu i hasła użytkownika
exports.updateAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { login, newPassword, currentPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Niepoprawne hasło!" });

    if (login && login !== user.username) {
      const existing = await User.findOne({ username: login });
      if (existing) return res.status(400).json({ message: "Taki login już istnieje!" });
      user.username = login;
    }
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }
    await user.save();
    res.json({ message: "Zaktualizowano konto!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/auth/delete
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ msg: 'Niepoprawne hasło!' });

    await User.findByIdAndDelete(userId);
    res.json({ msg: 'Konto zostało usunięte.' });
  } catch (err) {
    res.status(500).json({ msg: 'Błąd serwera.' });
  }
};