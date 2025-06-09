const mongoose = require('mongoose');

const taskTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('TaskTemplate', taskTemplateSchema, 'taskTemplates');