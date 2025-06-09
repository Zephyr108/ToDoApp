const mongoose = require('mongoose');

// schemat szablonu zadania
const taskTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // tytuł jest wymagany
  }
});

// eksport modelu, z nazwą kolekcji "taskTemplates"
module.exports = mongoose.model('TaskTemplate', taskTemplateSchema, 'taskTemplates');