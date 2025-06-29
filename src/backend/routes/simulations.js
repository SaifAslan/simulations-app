// src/backend/routes/simulation.js
const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const { body, param } = require('express-validator');
const validate = require('../middleware/validation');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// Validation middleware
const createSimulationValidation = [
  body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
  body('description').notEmpty().isString().withMessage('Description is required and must be a string')
];

const updateSimulationValidation = [
  param('id').isMongoId().withMessage('Invalid simulation ID'),
  body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
  body('description').notEmpty().isString().withMessage('Description is required and must be a string')
];

const getSimulationsByIdsValidation = [
  body('ids').isArray({ min: 1 }).withMessage('IDs must be a non-empty array'),
  body('ids.*').isMongoId().withMessage('Each ID must be a valid MongoDB ObjectId')
];

const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid simulation ID')
];

// Simulation routes
router.post('/', isLoggedIn, isAdmin, validate(createSimulationValidation), simulationController.createSimulation);
router.get('/', isLoggedIn, isAdmin, simulationController.getAllSimulations);
router.post('/multiple', isLoggedIn, isAdmin, validate(getSimulationsByIdsValidation), simulationController.getSimulationsByIds);

// Recycle bin routes
router.get('/bin/all', isLoggedIn, isAdmin, simulationController.getRecycleBin);
router.post('/bin/restore/:id', isLoggedIn, isAdmin, validate(mongoIdValidation), simulationController.restoreSimulation);
router.delete('/bin/:id', isLoggedIn, isAdmin, validate(mongoIdValidation), simulationController.permanentDeleteSimulation);
router.delete('/bin/empty/all', isLoggedIn, isAdmin, simulationController.emptyRecycleBin);

// Individual simulation routes
router.get('/:id', isLoggedIn, isAdmin, validate(mongoIdValidation), simulationController.getSimulationById);
router.put('/:id', isLoggedIn, isAdmin, validate(updateSimulationValidation), simulationController.updateSimulation);
router.delete('/:id', isLoggedIn, isAdmin, validate(mongoIdValidation), simulationController.deleteSimulation);

module.exports = router;