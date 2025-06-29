
// src/backend/controllers/simulationController.js
const Simulation = require('../models/Simulation');
const User = require('../models/User');

exports.createSimulation = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const simulation = new Simulation({ name, description });
    await simulation.save();
    res.status(201).json(simulation);
  } catch (error) {
    next(error);
  }
};

exports.getAllSimulations = async (req, res, next) => {
  try {
    const simulations = await Simulation.find({ isDeleted: false });
    res.json(simulations);
  } catch (error) {
    next(error);
  }
};

exports.getSimulationsByIds = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const simulations = await Simulation.find({ 
      _id: { $in: ids }, 
      isDeleted: false 
    });
    res.json(simulations);
  } catch (error) {
    next(error);
  }
};

exports.getSimulationById = async (req, res, next) => {
  try {
    const simulation = await Simulation.findOne({ 
      _id: req.params.id, 
      isDeleted: false 
    });
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }
    res.json(simulation);
  } catch (error) {
    next(error);
  }
};

exports.updateSimulation = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const simulation = await Simulation.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { name, description },
      { new: true, runValidators: true }
    );
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }
    res.json(simulation);
  } catch (error) {
    next(error);
  }
};

exports.deleteSimulation = async (req, res, next) => {
  try {
    const simulation = await Simulation.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }
    res.json({ message: 'Simulation moved to recycle bin' });
  } catch (error) {
    next(error);
  }
};

exports.getRecycleBin = async (req, res, next) => {
  try {
    const simulations = await Simulation.find({ isDeleted: true });
    res.json(simulations);
  } catch (error) {
    next(error);
  }
};

exports.restoreSimulation = async (req, res, next) => {
  try {
    const simulation = await Simulation.findOneAndUpdate(
      { _id: req.params.id, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found in recycle bin' });
    }
    console.log(simulation);
    res.json({ message: 'Simulation restored successfully', simulation });
  } catch (error) {
    next(error);
  }
};

exports.permanentDeleteSimulation = async (req, res, next) => {
  try {
    const simulation = await Simulation.findOneAndDelete({ 
      _id: req.params.id, 
      isDeleted: true 
    });
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found in recycle bin' });
    }
    res.json({ message: 'Simulation permanently deleted' });
  } catch (error) {
    next(error);
  }
};

exports.emptyRecycleBin = async (req, res, next) => {
  try {
    const result = await Simulation.deleteMany({ isDeleted: true });
    res.json({ 
      message: 'Recycle bin emptied successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    next(error);
  }
};