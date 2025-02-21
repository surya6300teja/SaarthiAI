const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  basics: {
    name: String,
    title: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    summary: String
  },
  experience: [{
    company: String,
    position: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String
  }],
  education: [{
    school: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String
  }],
  skills: [String],
  projects: [{
    name: String,
    description: String,
    startDate: String,
    endDate: String,
    url: String,
    technologies: [String]
  }],
  achievements: [{
    title: String,
    date: String,
    description: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', ResumeSchema);
