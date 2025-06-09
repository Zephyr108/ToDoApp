const mongoose = require('mongoose');

// schemat zadania
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true }, // tytuł
    done: { type: Boolean, default: false }, // czy zrobione
    deadline: { type: Date, required: false }, // termin
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // kto dodał
});

// eksport modelu
module.exports = mongoose.model('Task', taskSchema);