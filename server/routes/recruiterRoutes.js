const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Recruiter = require('../models/Recruiter');
const User = require('../models/User');

// Register recruiter
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, company, position } = req.body;

    // Check if recruiter already exists
    const existingRecruiter = await Recruiter.findOne({ email: email.toLowerCase() });
    if (existingRecruiter) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Create new recruiter
    const recruiter = new Recruiter({
      name,
      email: email.toLowerCase(),
      password,
      company,
      position
    });

    await recruiter.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Recruiter registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Error registering recruiter'
    });
  }
});

// Login recruiter
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find recruiter
    const recruiter = await Recruiter.findOne({ email: email.toLowerCase() }).select('+password');
    if (!recruiter) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: recruiter._id, role: 'recruiter' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      success: true,
      token,
      user: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        company: recruiter.company,
        position: recruiter.position,
        role: 'recruiter'
      }
    });

  } catch (error) {
    console.error('Recruiter login error:', error);
    res.status(500).json({
      success: false,
      error: 'Error logging in'
    });
  }
});

// Get filtered candidates
router.get('/candidates', async (req, res) => {
  try {
    const { jobRole, location, experience } = req.query;
    
    // Build filter query
    const query = { role: 'user' };
    
    if (jobRole && jobRole !== 'all') {
      query.jobRole = jobRole;
    }
    
    if (location && location !== 'all') {
      query.location = location;
    }
    
    if (experience && experience !== 'all') {
      // Parse experience range
      const [min, max] = experience.split('-').map(Number);
      if (max) {
        query.yearsOfExperience = { $gte: min, $lte: max };
      } else {
        // For 8+ years case
        query.yearsOfExperience = { $gte: min };
      }
    }

    const candidates = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    // Calculate match score based on filters
    const candidatesWithScore = candidates.map(candidate => {
      let matchScore = 0;
      let totalCriteria = 0;

      if (jobRole && jobRole !== 'all') {
        totalCriteria++;
        if (candidate.jobRole === jobRole) matchScore++;
      }

      if (location && location !== 'all') {
        totalCriteria++;
        if (candidate.location === location) matchScore++;
      }

      if (experience && experience !== 'all') {
        totalCriteria++;
        const [min, max] = experience.split('-').map(Number);
        const exp = candidate.yearsOfExperience;
        if (max) {
          if (exp >= min && exp <= max) matchScore++;
        } else {
          if (exp >= min) matchScore++;
        }
      }

      const score = totalCriteria > 0 ? (matchScore / totalCriteria) * 100 : 100;

      return {
        ...candidate.toObject(),
        matchScore: Math.round(score)
      };
    });

    res.json({
      success: true,
      candidates: candidatesWithScore
    });

  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching candidates'
    });
  }
});

// Get dashboard statistics
router.get('/dashboard-stats', async (req, res) => {
  try {
    // Get total number of candidates (normal users)
    const totalCandidates = await User.countDocuments({ role: 'user' });

    // For now, we'll return placeholder values for other stats
    // You can update these when you implement jobs and interviews
    const stats = {
      activeJobs: 0,  // Placeholder until job posting feature is implemented
      totalCandidates,
      scheduledInterviews: 0  // Placeholder until interview scheduling is implemented
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching dashboard statistics'
    });
  }
});

module.exports = router; 