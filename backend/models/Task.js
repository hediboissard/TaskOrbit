const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'L’identifiant du projet est obligatoire'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L’identifiant utilisateur est obligatoire'],
  },
  title: {
    type: String,
    required: [true, 'Le titre de la tâche est obligatoire'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'done'],
    default: 'todo',
  },
  deadline: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt on every save
taskSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Task', taskSchema);
