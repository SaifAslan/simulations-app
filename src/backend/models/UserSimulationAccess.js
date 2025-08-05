// models/UserSimulationAccess.js
const mongoose = require('mongoose');

const userSimulationAccessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  simulation: { type: mongoose.Schema.Types.ObjectId, ref: 'Simulation', required: true },
  key: { type: mongoose.Schema.Types.ObjectId, ref: 'Key', required: true },
  activationDate: { type: Date, default: Date.now },
  lastActivationDate: { type: Date, default: Date.now }, // New field for tracking last activation
  trialsLeft: { type: Number, required: true }
});

module.exports = mongoose.models.UserSimulationAccess || mongoose.model('UserSimulationAccess', userSimulationAccessSchema);
