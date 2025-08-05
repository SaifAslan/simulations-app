const express = require('express');
const router = express.Router();
const keyController = require('../controllers/keyController');
const { body, param } = require('express-validator');
const validate = require('../middleware/validation');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// Validation middleware
const createKeyValidation = [
  body('expiryDate').isISO8601().withMessage('Expiry date must be a valid date'),
  body('numberOfTrials').isInt({ min: 1 }).withMessage('Number of trials must be a positive integer'),
  body('keyCode').notEmpty().isString().withMessage('Key code is required and must be a string')
];

const deleteKeyValidation = [
  param('keyCode').notEmpty().isString().withMessage('Key code is required and must be a string')
];

const deactivateKeyValidation = [
  param('keyCode').notEmpty().isString().withMessage('Key code is required and must be a string')
];

const useKeyValidation = [
  param('keyCode').notEmpty().isString().withMessage('Key code is required and must be a string'),
  body('simulationId').notEmpty().isString().withMessage('Simulation ID is required and must be a string')
];

const checkKeyValidation = [
  param('keyCode').notEmpty().isString().withMessage('Key code is required and must be a string')
];

// Key routes
router.post('/', isLoggedIn, isAdmin, validate(createKeyValidation), keyController.createKey);
router.delete('/:keyCode', isLoggedIn, isAdmin, validate(deleteKeyValidation), keyController.deleteKey);
router.put('/:keyCode/deactivate', isLoggedIn, isAdmin, validate(deactivateKeyValidation), keyController.deactivateKey);
router.put('/:keyCode/activate', isLoggedIn, validate(useKeyValidation), keyController.useKey);
router.post('/checkKey/:keyCode', validate(checkKeyValidation), keyController.checkKey);

module.exports = router;

