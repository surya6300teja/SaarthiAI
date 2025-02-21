const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error');
const aiRoutes = require('./routes/ai.routes');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100
});
app.use(limiter);

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

// Import routes
const auth = require('./routes/authRoutes');
const resume = require('./routes/resumeRoutes');

// Mount routers - Fix: Use the router objects directly
app.use('/api/v1/auth', auth);
app.use('/api/v1/resumes', resume);
app.use('/api/v1/ai', aiRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000; // Make sure this matches your frontend api.js baseURL

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
