const mongoose = require('mongoose');
const validator = require('validator');


const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

taskSchema.pre('save', async function(next) {
  const task = this;

  console.log('taskSchema.pre');

  next();
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;