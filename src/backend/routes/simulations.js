const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// Validation middleware
const createSimulationValidation = [
  body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
  body('description').notEmpty().isString().withMessage('Description is required and must be a string')
];

// Simulation routes
router.post('/', isLoggedIn, isAdmin, validate(createSimulationValidation), simulationController.createSimulation);
router.get('/', isLoggedIn, simulationController.getAllSimulations);

module.exports = router;