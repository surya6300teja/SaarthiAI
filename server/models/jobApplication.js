const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  companyName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  location: String,
  salary: String,
  status: {
    type: String,
    enum: ['Applied', 'Interview Scheduled', 'Offer Received', 'Rejected', 'Pending'],
    default: 'Applied'
  },
  deadline: Date,
  notes: String,
  applicationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema); 