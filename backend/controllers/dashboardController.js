const Lead = require('../models/Lead');
const Task = require('../models/Task');
const Company = require('../models/Company');

const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments({ isDeleted: false });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified', isDeleted: false });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasksDueToday = await Task.countDocuments({
      dueDate: { $gte: today, $lt: tomorrow }
    });
    
    const completedTasks = await Task.countDocuments({ status: 'Done' });

    res.json({
      totalLeads,
      qualifiedLeads,
      tasksDueToday,
      completedTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats };
