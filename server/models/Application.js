const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'screening', 'interview', 'offer', 'rejected', 'accepted'],
    default: 'applied'
  },
  timeline: [{
    status: {
      type: String,
      enum: ['applied', 'screening', 'interview', 'offer', 'rejected', 'accepted']
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  notes: [{
    content: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  nextSteps: {
    type: String,
    enum: ['follow_up', 'prepare_interview', 'submit_documents', 'negotiate_offer', 'none'],
    default: 'none'
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
