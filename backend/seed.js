const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
const Company = require('./src/models/Company');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Company.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@crm.com',
      password: hashedPassword
    });

    const company1 = await Company.create({
      name: 'ABC Corp',
      industry: 'IT',
      location: 'Chennai'
    });

    console.log('Data Seeded Successfully');
    console.log('Admin Email: admin@crm.com');
    console.log('Admin Password: password123');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
