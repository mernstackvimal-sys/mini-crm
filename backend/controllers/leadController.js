const Lead = require('../models/Lead');

const getLeads = async (req, res) => {
  const { search = '', status } = req.query;

  const query = { isDeleted: false };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (status) {
    query.status = status;
  }

  try {
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('company', 'name')
      .exec();

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createLead = async (req, res) => {
  const { name, email, phone, status, assignedTo, company } = req.body;

  try {
    const lead = new Lead({ name, email, phone, status, assignedTo, company });
    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.name = req.body.name || lead.name;
      lead.email = req.body.email || lead.email;
      lead.phone = req.body.phone || lead.phone;
      lead.status = req.body.status || lead.status;
      lead.assignedTo = req.body.assignedTo || lead.assignedTo;
      lead.company = req.body.company || lead.company;

      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.isDeleted = true;
      await lead.save();
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
      res.json(lead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLeads, getLeadById, createLead, updateLead, deleteLead };
