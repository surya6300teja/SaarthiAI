const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const updateUserRoles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all users without a role to have 'user' role
    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user' } }
    );

    console.log(`Updated ${result.modifiedCount} users`);
    
    // Verify the update
    const totalUsers = await User.countDocuments({ role: 'user' });
    console.log(`Total users with 'user' role: ${totalUsers}`);

    process.exit(0);
  } catch (error) {
    console.error('Error updating user roles:', error);
    process.exit(1);
  }
};

updateUserRoles(); 