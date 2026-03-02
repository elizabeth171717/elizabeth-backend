const userSchema = require("../models/AnahuacUser");
const getTenantDB = require("../utils/getTenantDB");

const getAllUsers = async (req, res) => {
  const client = req.params.client;

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const users = await User.find().select("-password");
    res.json(users);

  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const adminUpdateUser = async (req, res) => {
  const client = req.params.client;
  const { userId } = req.params;

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const user = await User.findByIdAndUpdate(userId, req.body, { new: true }).select("-password");
    res.json(user);

  } catch (err) {
    console.error("Admin update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const adminChangePassword = async (req, res) => {
  const client = req.params.client;
  const { userId } = req.params;
  const bcrypt = require("bcryptjs");

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const hashed = await bcrypt.hash(req.body.password, 10);
    await User.findByIdAndUpdate(userId, { password: hashed });

    res.json({ message: "Password updated" });

  } catch (err) {
    console.error("Admin password change error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllUsers, adminUpdateUser, adminChangePassword };
