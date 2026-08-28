const express = require('express');
const router = express.Router();
const { getCompanies, getCompanyById, createCompany } = require('../controllers/companyController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getCompanies)
  .post(protect, createCompany);

router.route('/:id')
  .get(protect, getCompanyById);

module.exports = router;
