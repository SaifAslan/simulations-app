const Key = require('../models/Key');
const User = require('../models/User');
const UserSimulationAccess = require('../models/UserSimulationAccess');

exports.createKey = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      const error = new Error('Only admins can create keys');
      error.statusCode = 403;
      return next(error);
    }
    const { expiryDate, numberOfTrials, keyCode } = req.body;
    
    // Check if keyCode is unique
    const existingKey = await Key.findOne({ keyCode });
    if (existingKey) {
      const error = new Error('Key code already exists');
      error.statusCode = 400;
      return next(error);
    }

    const key = new Key({ expiryDate, numberOfTrials, creator: user._id, keyCode });
    await key.save();
    res.status(201).json(key);
  } catch (error) {
    next(error);
  }
};

exports.deleteKey = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      const error = new Error('Only admins can delete keys');
      error.statusCode = 403;
      return next(error);
    }
    const key = await Key.findOneAndDelete({ keyCode: req.params.keyCode });
    if (!key) {
      const error = new Error('Key not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ message: 'Key deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deactivateKey = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      const error = new Error('Only admins can deactivate keys');
      error.statusCode = 403;
      return next(error);
    }
    const key = await Key.findOneAndUpdate({ keyCode: req.params.keyCode }, { isActive: false }, { new: true });
    if (!key) {
      const error = new Error('Key not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(key);
  } catch (error) {
    next(error);
  }
};


exports.useKey = async (req, res, next) => {
  try {
    const key = await Key.findOne({ keyCode: req.params.keyCode });
    if (!key || !key.isActive || key.expiryDate < Date.now()) {
      const error = new Error('Invalid key');
      error.statusCode = 400;
      return next(error);
    }

    let userSimulationAccess = await UserSimulationAccess.findOne({
      user: req.userId,
      simulation: req.body.simulationId,
      key: key._id
    });

    if (userSimulationAccess) {
      // Check if there are trials left
      if (userSimulationAccess.trialsLeft <= 0) {
        const error = new Error('No trials left for this key');
        error.statusCode = 400;
        return next(error);
      }

      // Decrease trials and update last activation date
      userSimulationAccess.trialsLeft -= 1;
      userSimulationAccess.lastActivationDate = new Date();
      await userSimulationAccess.save();
    } else {
      // Create new access if it doesn't exist
      userSimulationAccess = new UserSimulationAccess({
        user: req.userId,
        simulation: req.body.simulationId,
        key: key._id,
        trialsLeft: key.numberOfTrials - 1, // Start with one less trial
        // lastActivationDate: new Date() // Set last activation to now
      });
      await userSimulationAccess.save();
    }

    res.json(userSimulationAccess);
  } catch (error) {
    next(error);
  }
};
exports.checkKey = async (req, res, next) => {
  try {
    const key = await Key.findOne({ keyCode: req.params.keyCode });
    if (!key || !key.isActive || key.expiryDate < Date.now()) {
      return res.json({ valid: false, message: 'Invalid or expired key' });
    }
    
    const existingAccess = await UserSimulationAccess.findOne({ key: key._id });
    if (existingAccess) {
      return res.json({ valid: false, message: 'Key already activated by another user' });
    }

    res.json({ valid: true, message: 'Key is valid and can be used' });
  } catch (error) {
    next(error);
  }
};