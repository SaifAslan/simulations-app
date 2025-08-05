const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  route: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Route can only contain lowercase letters, numbers, and hyphens']
  },
  deletedAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Ensure unique constraint only applies to non-deleted simulations
simulationSchema.index({ route: 1, isDeleted: 1 }, { 
  unique: true, 
  partialFilterExpression: { isDeleted: false } 
});

module.exports = mongoose.models.Simulation || mongoose.model('Simulation', simulationSchema);