const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// schemat użytkownika
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // nazwa użytkownika
    password: { type: String, required: true } // hasło
});

// przed zapisem — szyfruj hasło
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // jeśli hasło się nie zmieniło
    this.password = await bcrypt.hash(this.password, 10); // szyfrowanie
    next();
});

// sprawdzanie hasła przy logowaniu
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

// eksport modelu
module.exports = mongoose.model('User', userSchema);
