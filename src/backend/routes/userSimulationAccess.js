const express = require('express');
const { getUserSimulation } = require("../controllers/userSimulationAccessController");
const { isLoggedIn } = require("../middleware/auth");

const router = express.Router();

router.get('/', isLoggedIn ,getUserSimulation)

module.exports = router;