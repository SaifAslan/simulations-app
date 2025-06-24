const Key = require('../models/Key');
const User = require('../models/User');
const UserSimulationAccess = require('../models/UserSimulationAccess');

exports.createKey = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create keys' });
    }
    const { expiryDate, numberOfTrials, keyCode } = req.body;
    
    // Check if keyCode is unique
    const existingKey = await Key.findOne({ keyCode });
    if (existingKey) {
      return res.status(400).json({ error: 'Key code already exists' });
    }

    const key = new Key({ expiryDate, numberOfTrials, creator: user._id, keyCode });
    await key.save();
    res.status(201).json(key);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteKey = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete keys' });
    }
    const key = await Key.findOneAndDelete({ keyCode: req.params.keyCode });
    if (!key) {
      return res.status(404).json({ error: 'Key not found' });
    }
    res.json({ message: 'Key deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deactivateKey = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can deactivate keys' });
    }
    const key = await Key.findOneAndUpdate({ keyCode: req.params.keyCode }, { isActive: false }, { new: true });
    if (!key) {
      return res.status(404).json({ error: 'Key not found' });
    }
    res.json(key);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.useKey = async (req, res) => {
  try {
    const key = await Key.findOne({ keyCode: req.params.keyCode });
    if (!key || !key.isActive || key.expiryDate < Date.now()) {
      return res.status(400).json({ error: 'Invalid key' });
    }

    let userSimulationAccess = await UserSimulationAccess.findOne({
      user: req.userId,
      simulation: req.body.simulationId,
      key: key._id
    });

    if (userSimulationAccess) {
      // Check if there are trials left
      if (userSimulationAccess.trialsLeft <= 0) {
        return res.status(400).json({ error: 'No trials left for this key' });
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
    res.status(400).json({ error: error.message });
  }
};
exports.checkKey = async (req, res) => {
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
    res.status(500).json({ valid: false, message: 'Server error while checking key' });
  }
};