// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = require("../models/User");
const getTenantDB = require("../utils/getTenantDB");
const tenantConfigs = require("../config/tenantConfigs");

const signup = async (req, res) => {
  const client = req.params.client; // ✅ take client directly from params
  const { email, password } = req.body;

  const tenant = tenantConfigs[client];
  if (!tenant) {
    return res.status(400).json({ message: "Unrecognized client" });
  }

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ email, password: hashedPassword }).save();

    return res.status(201).json({ message: `${client} admin account created!` });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const client = req.params.client;
  const { email, password } = req.body;

  const tenant = tenantConfigs[client];
  if (!tenant) return res.status(400).json({ message: "Unrecognized client" });

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, tenant.JWT_SECRET, { expiresIn: "1d" });

    return res.json({ token });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login };
