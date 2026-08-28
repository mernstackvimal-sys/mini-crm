const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('lead', 'name')
      .populate('assignedTo', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  const { title, lead, assignedTo, dueDate } = req.body;

  try {
    const task = new Task({ title, lead, assignedTo, dueDate });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }

      task.status = req.body.status || task.status;
      task.title = req.body.title || task.title;
      task.lead = req.body.lead || task.lead;
      if (req.body.dueDate !== undefined) {
        task.dueDate = req.body.dueDate;
      }
      
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this task' });
      }
      
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
