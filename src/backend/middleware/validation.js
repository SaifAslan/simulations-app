const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().forEach(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(422).json({ errors: extractedErrors });
  };
};

module.exports = validate;

