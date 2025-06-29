// controllers/userSimulationAccessController.js
const UserSimulationAccess = require('../models/UserSimulationAccess');

// Fetch user's simulations
 exports.getUserSimulation = async (req, res) => {
  try {
    const userId = req.userId; // Assuming user ID is available in the token payload after verification
    let query = { user: userId }; // Fetch only simulations with trials left
    
    if (req.query.all === 'true') {
      query = { user: userId }; // If you want all simulations, regardless of trials
    }

    const userSimulations = await UserSimulationAccess.find(query)
      .populate('simulation', 'title description imageUrl') // Populate simulation details
      .exec();

    res.json(userSimulations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

