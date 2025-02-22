const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const skillCraftRoutes = require('./routes/skillCraftRoutes');
const jobApplicationsRoutes = require('./routes/jobApplications');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());


// Cookie parser
app.use(cookieParser());

// Enable CORS - Before routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Add headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      body: "OK"
    });
  }
  
  next();
});

// Route files
const auth = require('./routes/authRoutes');
const resumes = require('./routes/resumeRoutes');
const aiRoutes = require('./routes/ai.routes');
const recruiterRoutes = require('./routes/recruiterRoutes');

// Mount routers
app.use('/api/v1/auth/recruiter', recruiterRoutes);
app.use('/api/v1/auth', auth);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/resumes', resumes);
app.use('/api/v1/skill-craft', skillCraftRoutes);
app.use('/api/v1/job-applications', jobApplicationsRoutes);

// Error handler
app.use(errorHandler);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

