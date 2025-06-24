const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const keyRoutes = require('./keys');
const simulationRoutes = require('./simulations');
const leaderboardRoutes = require('./leaderboard');
const userSimulationAccessRoutes = require('./userSimulationAccess');

// Mount routes
router.use('/users', userRoutes);
router.use('/keys', keyRoutes);
router.use('/simulations', simulationRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/user-simulations', userSimulationAccessRoutes);


module.exports = router;