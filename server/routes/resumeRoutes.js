const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Resume = require('../models/Resume');

// Get all resumes for a user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.userId });
    res.json({
      success: true,
      data: resumes
    });
  } catch (error) {
    console.error('Get Resumes Error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching resumes'
    });
  }
});

// Get a single resume
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Get Resume Error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching resume'
    });
  }
});

// Create a new resume
router.post('/', auth, async (req, res) => {
  try {
    const resume = new Resume({
      ...req.body,
      user: req.user.userId,
      lastUpdated: new Date()
    });

    await resume.save();

    res.status(201).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Create Resume Error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating resume'
    });
  }
});

// Update a resume
router.put('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Update Resume Error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating resume'
    });
  }
});

// Delete a resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting resume'
    });
  }
});

module.exports = router;
