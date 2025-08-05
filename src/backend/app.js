// app.js
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const {expressjwt} = require('express-jwt');
const cors = require('cors'); // Import cors middleware

const app = express();

// Middleware
app.use(express.json());

const secretKey = 'your-secret-key'; // Replace with a strong secret key
app.use(
  expressjwt({ secret: secretKey, algorithms: ['HS256'] }).unless({
    path: [ '/users/login','/users/register', /^\/keys\/checkKey\/.*/], // Do NOT add '/users/admins' here
  })
);
// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000'], // Allow requests from the frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Routes
app.use(routes);

// Centralized error handler (should be after all routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const uri = "mongodb+srv://saif:LcciKEOJi6ulVxHT@cluster0.6zbtdaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Database connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3030;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;