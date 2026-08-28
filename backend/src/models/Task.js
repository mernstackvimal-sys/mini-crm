const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Pending', 'Done'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
