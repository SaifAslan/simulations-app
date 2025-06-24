const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const { isLoggedIn } = require('../middleware/auth');

const createUserValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password').custom((value, { req }) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      throw new Error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character');
    }
    return true;
  }),
  body('phoneNumber').optional().isString().withMessage('Phone number must be a string'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('surname').optional().isString().withMessage('Surname must be a string'),
  body('keyCode').optional().isString().withMessage('Key code must be a string')
];

const createAdminValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password').custom((value, { req }) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      throw new Error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character');
    }
    return true;
  })
];

const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// User routes
router.post('/register', validate(createUserValidation), userController.createUser);
router.post('/admins', validate(createAdminValidation), userController.createAdmin);
router.post('/login', validate(loginValidation), userController.login);
router.post('/logout', isLoggedIn, userController.logout);

module.exports = router;