const express = require('express');
const router = express.Router();
const JobApplication = require('../models/jobApplication');

// Get all job applications
router.get('/', async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .sort({ applicationDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new job application
router.post('/', async (req, res) => {
  try {
    const newApplication = new JobApplication({
      companyName: req.body.companyName,
      jobTitle: req.body.jobTitle,
      location: req.body.location,
      salary: req.body.salary,
      status: req.body.status,
      deadline: req.body.deadline,
      notes: req.body.notes,
      applicationDate: new Date()
    });

    const application = await newApplication.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a job application
router.delete('/:id', async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }
    await application.deleteOne();
    res.json({ msg: 'Application removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;