const Task = require('../models/Task');

// Pobierz zadania użytkownika
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
};

// Utwórz nowe zadanie
exports.createTask = async (req, res) => {
  const { title, deadline } = req.body;
  if (!title) return res.status(400).json({ msg: 'Brak tytułu.' });

  const task = new Task({
    title,
    deadline,
    user: req.user.id
  });

  await task.save();
  res.status(201).json(task);
};

// Aktualizuj zadanie
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;

  const task = await Task.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { title, done },
    { new: true }
  );

  if (!task) return res.status(404).json({ msg: 'Nie znaleziono zadania.' });
  res.json(task);
};

// Usuń zadanie
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
  if (!task) return res.status(404).json({ msg: 'Nie znaleziono zadania.' });

  res.json({ msg: 'Usunięto zadanie.' });
};
