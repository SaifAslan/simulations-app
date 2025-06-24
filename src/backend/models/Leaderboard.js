// models/Leaderboard.js
const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  simulation: { type: mongoose.Schema.Types.ObjectId, ref: 'Simulation', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true }
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
