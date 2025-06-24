// models/Simulation.js
const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Simulation', simulationSchema);