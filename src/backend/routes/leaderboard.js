const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const { isLoggedIn } = require('../middleware/auth');

// Validation middleware
const addScoreValidation = [
  body('simulationId').notEmpty().isString().withMessage('Simulation ID is required and must be a string'),
  body('score').isInt({ min: 0 }).withMessage('Score must be a non-negative integer')
];

// Leaderboard routes
router.post('/', isLoggedIn, validate(addScoreValidation), leaderboardController.addScore);
router.get('/', isLoggedIn, leaderboardController.getLeaderboard);


module.exports = router;