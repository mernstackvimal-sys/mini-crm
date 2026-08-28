const Company = require('../models/Company');
const Lead = require('../models/Lead');

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (company) {
      const leads = await Lead.find({ company: company._id, isDeleted: false });
      res.json({ company, leads });
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCompany = async (req, res) => {
  const { name, industry, location } = req.body;

  try {
    const company = new Company({ name, industry, location });
    const createdCompany = await company.save();
    res.status(201).json(createdCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getCompanies, getCompanyById, createCompany };
