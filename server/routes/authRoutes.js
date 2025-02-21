const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Create new user with role
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'user'  // Explicitly set role to 'user'
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Error registering user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Find user and select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    console.log('Login attempt:', { email, userFound: !!user });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Error logging in',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error getting user data' 
    });
  }
});

// Verify token
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Token is invalid or user not found'
      });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Token Verification Error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// Save resume data
router.post('/save-resume', auth, async (req, res) => {
  try {
    const { resumeData } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Save resume data
    user.resumeData = resumeData;
    await user.save();

    res.json({
      success: true,
      message: 'Resume data saved successfully'
    });
  } catch (error) {
    console.error('Error saving resume data:', error);
    res.status(500).json({
      success: false,
      error: 'Error saving resume data'
    });
  }
});

// Upload resume PDF
router.post('/upload-resume-pdf', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file provided'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Save PDF to user document
    user.resume = {
      pdf: {
        data: req.file.buffer,
        contentType: 'application/pdf'
      },
      lastUpdated: new Date()
    };

    await user.save();

    res.json({
      success: true,
      message: 'Resume PDF uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading resume PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Error uploading resume PDF'
    });
  }
});

// Download resume PDF
router.get('/resume/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.resume?.pdf?.data) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    res.set('Content-Type', user.resume.pdf.contentType);
    res.send(user.resume.pdf.data);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ success: false, error: 'Error downloading resume' });
  }
});

// Update user profile
router.put('/update-profile', auth, async (req, res) => {
  try {
    const { jobRole, experience, location } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update fields
    user.jobRole = jobRole;
    user.experience = experience;
    user.location = location;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating profile'
    });
  }
});

// Get user profile
router.get('/user-profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password') // Exclude password from the response
      .lean(); // Convert to plain JavaScript object

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        ...user,
        // Format dates for frontend
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
        resume: {
          ...user.resume,
          lastUpdated: user.resume?.lastUpdated?.toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user profile'
    });
  }
});

// Get resume PDF
router.get('/resume/:userId/view', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.resume?.pdf?.data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Resume not found' 
      });
    }

    // Set response headers for PDF viewing in browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=resume.pdf');
    res.send(user.resume.pdf.data);
  } catch (error) {
    console.error('Error viewing resume:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error viewing resume' 
    });
  }
});

// Get resume data for editing
router.get('/resume/:userId/edit', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Resume not found' 
      });
    }

    // Check if the requesting user is the owner of the resume
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized access' 
      });
    }

    res.json({
      success: true,
      resumeData: user.resumeData
    });
  } catch (error) {
    console.error('Error getting resume data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error getting resume data' 
    });
  }
});

// Get filtered candidates with resume data
router.get('/recruiter/candidates', auth, async (req, res) => {
  try {
    const { jobRole, location, experience } = req.query;
    
    // Build filter query
    let filterQuery = {};
    
    if (jobRole && jobRole !== 'all') {
      filterQuery['resumeData.basics.title'] = jobRole;
    }
    
    if (location && location !== 'all') {
      // Use regex for partial location matching
      filterQuery['resumeData.basics.location'] = new RegExp(location, 'i');
    }
    
    if (experience && experience !== 'all') {
      filterQuery['resumeData.basics.experience'] = experience;
    }

    // Find users that match the filter criteria and have resumes
    const candidates = await User.find({
      ...filterQuery,
      'resume.pdf.data': { $exists: true },
      'resumeData.basics': { $exists: true },
      role: 'user' // Only get users, not recruiters
    }).select(`
      name
      email
      resumeData.basics
      resume.lastUpdated
      -_id
    `).lean();

    // Calculate match scores and format response
    const candidatesWithScore = candidates.map(candidate => {
      let matchScore = 0;
      const basics = candidate.resumeData.basics;
      
      // Job role match
      if (jobRole && jobRole !== 'all' && basics.title === jobRole) {
        matchScore += 40;
      }
      
      // Location match
      if (location && location !== 'all' && 
          basics.location && 
          basics.location.toLowerCase().includes(location.toLowerCase())) {
        matchScore += 30;
      }
      
      // Experience match
      if (experience && experience !== 'all' && basics.experience === experience) {
        matchScore += 30;
      }

      // Format the candidate data
      return {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        jobRole: basics.title || 'Not Specified',
        experience: basics.experience || 'Not Specified',
        location: basics.location || 'Not Specified',
        summary: basics.summary,
        skills: basics.skills,
        lastUpdated: candidate.resume.lastUpdated,
        matchScore
      };
    });

    // Sort by match score
    candidatesWithScore.sort((a, b) => b.matchScore - a.matchScore);

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

module.exports = router;
