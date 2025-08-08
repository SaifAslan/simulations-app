// app.js
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors'); // Import cors middleware
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Enable CORS early (before auth) and handle preflight requests
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

// Routes
app.use(routes);

// Centralized error handler (should be after all routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const uri = process.env.MONGODB_URI;

// Database connection
if (uri) {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI is not set. Backend will start without a database connection.');
}

const PORT = process.env.PORT || 3030;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;