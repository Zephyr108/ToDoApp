const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// kontrolery zadań
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const TaskTemplate = require('../models/TaskTemplate');

// zadania – wymagana autoryzacja
router.get('/', auth, getTasks);         // pobierz wszystkie zadania
router.post('/', auth, createTask);      // dodaj zadanie
router.put('/:id', auth, updateTask);    // edytuj zadanie
router.delete('/:id', auth, deleteTask); // usuń zadanie

// szablony zadań – dostępne bez logowania
router.get('/templates', async (req, res) => {
  try {
    const templates = await TaskTemplate.find(); // pobierz wszystkie szablony
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Błąd pobierania szablonów zadań' });
  }
});

// dodaj nowy szablon
router.post('/templates', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Brakuje tytułu' });

  try {
    const newTemplate = new TaskTemplate({ title });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(500).json({ error: 'Błąd dodawania szablonu' });
  }
});

// usuń szablon po ID
router.delete('/templates/:id', async (req, res) => {
  try {
    await TaskTemplate.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Błąd usuwania szablonu' });
  }
});

// eksport routera
module.exports = router;
