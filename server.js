const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const schoolRoutes = require('./routes/schoolRoutes');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Database health check endpoint
app.get('/api/health', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) {
      return res.status(500).json({
        status: 'ERROR',
        message: 'Database connection failed',
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
    res.status(200).json({
      status: 'OK',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
    });
  });
});

// Diagnostic endpoint to check configuration
app.get('/api/diagnosis', (req, res) => {
  const diagnosis = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '5000',
    database: {
      host: process.env.DB_HOST || 'NOT SET',
      user: process.env.DB_USER || 'NOT SET',
      database: process.env.DB_NAME || 'NOT SET',
      isConfigured: !!(process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME),
    },
    checks: {},
  };

  // Check if database credentials are set
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    diagnosis.checks.environmentVariables = {
      status: 'FAILED',
      message: 'Missing database environment variables',
      missing: [
        !process.env.DB_HOST ? 'DB_HOST' : null,
        !process.env.DB_USER ? 'DB_USER' : null,
        !process.env.DB_PASSWORD ? 'DB_PASSWORD' : null,
        !process.env.DB_NAME ? 'DB_NAME' : null,
      ].filter(Boolean),
    };

    return res.status(200).json({
      ...diagnosis,
      status: 'ERROR',
      message: 'Database is not configured. Please set environment variables on Render.',
      solution: 'Go to Render Dashboard > Your Service > Environment > Add variables',
    });
  }

  // Try database connection
  db.query('SELECT 1', (err) => {
    if (err) {
      diagnosis.checks.database = {
        status: 'FAILED',
        message: 'Cannot connect to database',
        error: err.message,
      };
      res.status(200).json({
        ...diagnosis,
        status: 'ERROR',
        message: 'Database connection failed',
      });
    } else {
      diagnosis.checks.database = {
        status: 'OK',
        message: 'Database connection successful',
      };

      // Check if schools table exists
      db.query('SELECT 1 FROM schools LIMIT 1', (err) => {
        if (err) {
          diagnosis.checks.schema = {
            status: 'FAILED',
            message: 'Schools table does not exist',
            solution: 'Run the SQL script to create the schools table',
          };
        } else {
          diagnosis.checks.schema = {
            status: 'OK',
            message: 'Schools table exists',
          };
        }

        res.status(200).json({
          ...diagnosis,
          status: 'OK',
          message: 'All systems operational',
        });
      });
    }
  });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.use('/', schoolRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Visit http://localhost:${PORT} in your browser`);
});