// models/Key.js
const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({
  keyCode: {
    type: String,
    required: true,
    unique: true,
  },
  creationDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  numberOfTrials: { type: Number, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Key", keySchema);
