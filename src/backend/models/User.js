const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // Email is now required and must be unique
  email: { type: String, required: true, unique: true },
  // Username is now required and must be unique
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Optional fields
  phoneNumber: { type: String, required: false },
  name: { type: String, required: false },
  surname: { type: String, required: false },
  role: { type: String, enum: ['admin', 'client'], required: true }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);