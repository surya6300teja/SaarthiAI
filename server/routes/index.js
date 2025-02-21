const express = require('express');
const router = express.Router();
const aiRoutes = require('./ai.routes');

router.use('/ai', aiRoutes);

// Test route to verify API is working
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

module.exports = router; 