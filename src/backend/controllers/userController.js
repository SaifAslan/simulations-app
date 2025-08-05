// controllers/userController.js
const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const Key = require("../models/Key");
const UserSimulationAccess = require("../models/UserSimulationAccess");

exports.createUser = async (req, res, next) => {
  try {
    await checkEmailAlreadyExists(req.body.email);
    const { username, password, keyCode, email, name, surname } = req.body;
    const user = new User({
      username,
      password,
      role: "client",
      email,
      name,
      surname,
    });
    await user.save();

    if (keyCode) {
      const key = await Key.findOne({ keyCode });
      if (!key || !key.isActive || key.expiryDate < Date.now()) {
        return res.status(400).json({ error: "Invalid or expired key" });
      }

      // const existingAccess = await UserSimulationAccess.findOne({
      //   key: key._id,
      // });
      // if (existingAccess) {
      //   return res
      //     .status(400)
      //     .json({ error: "Key already activated by another user" });
      // }

      // const userSimulationAccess = new UserSimulationAccess({
      //   user: user._id,
      //   simulation: req.body.simulationId || "defaultSimulationId", // Adjust as needed
      //   key: key._id,
      //   trialsLeft: key.numberOfTrials - 1,
      // });
      // await userSimulationAccess.save();
    }

    const token = generateToken(user);
    res.status(201).json({
      message: "User created successfully",
      user: { ...user.toObject(), token },
    });
  } catch (error) {
    next(error);
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    await checkEmailAlreadyExists(req.body.email);
    const { username, password, email } = req.body;
    const user = new User({ username, password, email, role: "admin" });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      message: "User created successfully",
      user: { ...user.toObject(), token },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.json({
      message: "Logged in successfully",
      user: { ...user.toObject(), token },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  // Since JWT is stateless, logout is simply not sending the token back
  res.json({ message: "Logged out successfully" });
};

const checkEmailAlreadyExists = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }
};