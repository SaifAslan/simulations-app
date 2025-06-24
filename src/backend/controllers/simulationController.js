// controllers/simulationController.js
const Simulation = require('../models/Simulation');
const User = require('../models/User');

exports.createSimulation = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create simulations' });
    }
    const { name, description } = req.body;
    const simulation = new Simulation({ name, description });
    await simulation.save();
    res.status(201).json(simulation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSimulations = async (req, res) => {
  try {
    const simulations = await Simulation.find();
    res.json(simulations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};