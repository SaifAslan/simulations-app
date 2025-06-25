// controllers/leaderboardController.js
const Leaderboard = require('../models/Leaderboard');

exports.addScore = async (req, res, next) => {
  try {
    const { simulationId, score } = req.body;
    const leaderboardEntry = new Leaderboard({
      simulation: simulationId,
      user: req.userId,
      score
    });
    await leaderboardEntry.save();
    res.status(201).json(leaderboardEntry);
  } catch (error) {
    next(error);
  }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await Leaderboard.find()
      .populate({
        path: 'user',
        select: 'username',
      })
      .populate({
        path: 'simulation',
        select: 'name', 
      })
      .sort({ score: -1 })
      .limit(10);

    res.status(200).json(leaderboard);
  } catch (error) {
    next(error);
  }
};
