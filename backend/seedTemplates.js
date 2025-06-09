const mongoose = require('mongoose');
const TaskTemplate = require('./models/TaskTemplate');
require('dotenv').config();

console.log('Connecting to:', process.env.MONGO_URI);

// przykładowe szablony zadań
const templates = [
  { title: 'Zrób zakupy' },
  { title: 'Umyj naczynia' },
  { title: 'Wyślij maila do klienta' },
  { title: 'Wyprowadź psa' },
  { title: 'Zadzwoń do mamy' },
  { title: 'Odbierz paczkę z paczkomatu' },
  { title: 'Zrób pranie' },
  { title: 'Przygotuj prezentację' },
  { title: 'Umów wizytę u dentysty' },
  { title: 'Napisz raport miesięczny' },
  { title: 'Podlej kwiaty' },
  { title: 'Posprzątaj w domu' },
  { title: 'Przeczytaj rozdział książki' },
  { title: 'Zarezerwuj bilety do kina' },
  { title: 'Zaktualizuj CV' },
  { title: 'Wyślij kartkę urodzinową' },
  { title: 'Zrób backup komputera' },
  { title: 'Przygotuj listę zakupów' },
  { title: 'Zamów jedzenie na weekend' }
];

// połącz z bazą i dodaj dane
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await TaskTemplate.deleteMany({});       // wyczyść kolekcję
    await TaskTemplate.insertMany(templates); // dodaj nowe szablony
    console.log('Szablony zadań zostały dodane!');
    mongoose.disconnect();                   // rozłącz z bazą
  })
  .catch(err => console.error('Błąd połączenia z MongoDB', err));
