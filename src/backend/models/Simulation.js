// src/backend/models/Simulation.js
const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  deletedAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

module.exports = mongoose.models.Simulation || mongoose.model('Simulation', simulationSchema);
