const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = require("../models/BhopUser");
const getTenantDB = require("../utils/getTenantDB");
const tenantConfigs = require("../config/tenantConfigs");

const signup = async (req, res) => {
  try {
    const client = req.params.client;

    const tenant = tenantConfigs[client];
    if (!tenant) {
      return res.status(400).json({
        message: "Invalid tenant",
      });
    }

    const { name, email, password } = req.body;
const db = await getTenantDB(client);

const SnackUser =
  db.models.SnackUser ||
  db.model("SnackUser", userSchema);

const existingUser = await SnackUser.findOne({ email });

if (existingUser) {
  return res.status(400).json({
    message: "Email already exists",
  });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await SnackUser.create({
  name,
  email,
  password: hashedPassword,
});

    const token = jwt.sign(
      {
        userId: user._id,
      },
      tenant.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const login = async (req, res) => {
   console.log("🔥 BHOP LOGIN CONTROLLER HIT");

  try {
    const client = req.params.client;

    const tenant = tenantConfigs[client];
    if (!tenant) {
      return res.status(400).json({
        message: "Invalid tenant",
      });
    }

    const { email, password } = req.body;

    const db = await getTenantDB(client);

    const SnackUser =
      db.models.SnackUser ||
      db.model("SnackUser", userSchema);

    const user = await SnackUser.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      tenant.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  signup, login
};