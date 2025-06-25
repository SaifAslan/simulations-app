// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = 'your-secret-key'; // Replace with a strong secret key

exports.generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: '1y' });
};

exports.isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  });
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const errorHandler = (err, req, res, next) => {
  // Handle express-jwt UnauthorizedError
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }
  // ...existing code...
  const statusCode = err.statusCode || 500;
  const response = {
    error: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'An error occurred',
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }
  res.status(statusCode).json(response);
};