const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// wczytanie zmiennych środowiskowych
dotenv.config();

// trasy
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(cors()); // pozwala na zapytania z innych domen
app.use(express.json()); // parsowanie JSON-a z requesta

// obsługa ścieżek API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

// połączenie z bazą i uruchomienie serwera
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.log(err)); // jeśli błąd, pokaż w konsoli
