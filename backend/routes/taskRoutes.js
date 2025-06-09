const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const TaskTemplate = require('../models/TaskTemplate');

// Zadania – wymagają tokena
router.get('/', auth, getTasks);
router.post('/', auth, createTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

// Szablony zadań – nie wymagają logowania
router.get('/templates', async (req, res) => {
  try {
    const templates = await TaskTemplate.find();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Błąd pobierania szablonów zadań' });
  }
});

// Dodaj nowy szablon
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

// Usuń szablon
router.delete('/templates/:id', async (req, res) => {
  try {
    await TaskTemplate.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Błąd usuwania szablonu' });
  }
});

module.exports = router;
