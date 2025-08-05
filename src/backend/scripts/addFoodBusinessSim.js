const mongoose = require('mongoose');
const Simulation = require('../models/Simulation');

// MongoDB connection string - adjust as needed
const MONGODB_URI = "mongodb+srv://saif:LcciKEOJi6ulVxHT@cluster0.6zbtdaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function addFoodBusinessSimulation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if simulation already exists
    const existingSimulation = await Simulation.findOne({ 
      route: 'food-business-sim',
      isDeleted: false 
    });

    if (existingSimulation) {
      console.log('Food business simulation already exists');
      return;
    }

    // Create the food business simulation
    const foodBusinessSim = new Simulation({
      name: 'Street Food Business Simulator',
      description: 'Learn the fundamentals of business through a street food truck simulation. Make strategic decisions about products, locations, and business methods to maximize your revenue in this competitive environment.',
      route: 'food-business-sim'
    });

    await foodBusinessSim.save();
    console.log('Food business simulation created successfully:', foodBusinessSim);

  } catch (error) {
    console.error('Error creating food business simulation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
addFoodBusinessSimulation(); 