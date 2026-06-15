const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const generateCode = require("../utils/generateCode");
const sendAnahuacEmail = require("../utils/sendAnahuacEmail");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const userSchema = require("../models/AnahuacUser");
const anahuacMenuSchema = require("../models/AnahuacMenu");
const getTenantDB = require("../utils/getTenantDB");
const tenantConfigs = require("../config/tenantConfigs");
const sampleMenu = require("../data/sampleMenu");

console.log("🔥hi");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

const signup = async (req, res) => {
  const client = req.params.client;
  const { name, restaurantName, email, password } = req.body;

  const tenant = tenantConfigs[client];
  if (!tenant) {
    return res.status(400).json({ message: "Unrecognized client" });
  }

  try {
    const db = await getTenantDB(client);

    const User = db.models.User || db.model("User", userSchema);
    const Menu = db.models.Menu || db.model("Menu", anahuacMenuSchema); // ✅ ADD THIS

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ CREATE USER
    const newUser = await User.create({
      name,
      restaurantName,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    // ✅ CREATE MENU FOR THIS USER (THIS IS THE MISSING PIECE)
 


let baseSlug = generateSlug(newUser.restaurantName);
let slug = baseSlug;
let counter = 1;

while (await Menu.findOne({ slug })) {
  slug = `${baseSlug}-${counter}`;
  counter++;
}

await Menu.create({
  owner: newUser._id,
  restaurantName: newUser.restaurantName,
  slug,
    views: sampleMenu.views,
  sections: sampleMenu.sections,
});


    await sendAnahuacEmail(email, name, restaurantName, client);

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      tenant.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        restaurantName: newUser.restaurantName,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  console.log("🔥 ANAHUAC LOGIN CONTROLLER HIT");
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

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      tenant.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("TOKEN PAYLOAD:", { userId: user._id, role: user.role });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        restaurantName: user.restaurantName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  const client = req.params.client;
  const { currentPassword, newPassword } = req.body;

  const tenant = tenantConfigs[client];
  if (!tenant) return res.status(400).json({ message: "Unrecognized client" });

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("❌ Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const requestVerification = async (req, res) => {
  const client = req.params.client;
  const { email } = req.body;

  const tenant = tenantConfigs[client];
  if (!tenant) return res.status(400).json({ message: "Unrecognized client" });

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.json({ message: "Account already verified" });
    }

    const code = generateCode();
    user.verificationCode = code;
    user.verificationCodeExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(email, user.name, user.restaurantName, code, client);

    res.json({ message: "Verification code sent" });

  } catch (error) {
    console.error("❌ Request verify error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyAccount = async (req, res) => {
  const client = req.params.client;
  const { email, code } = req.body;

  const tenant = tenantConfigs[client];
  if (!tenant) return res.status(400).json({ message: "Unrecognized client" });

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Code expired" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.json({ message: "Account verified successfully 🎉" });

  } catch (error) {
    console.error("❌ Verify error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMe = async (req, res) => {
  const client = req.params.client;

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAccount = async (req, res) => {
  const client = req.params.client;

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const userId = req.userId;
    const { name, email, restaurantName, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (restaurantName) user.restaurantName = restaurantName;

    if (password && password.length >= 6) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: "Account updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        restaurantName: user.restaurantName,
      },
    });

  } catch (err) {
    console.error("Update account error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const client = req.params.client;
  const { email } = req.body;

  const tenant = tenantConfigs[client];

  if (!tenant) {
    return res.status(400).json({
      message: "Unrecognized client",
    });
  }

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const user = await User.findOne({ email });

    // Don't reveal whether email exists
    if (!user) {
      return res.json({
        message:
          "If an account exists, a reset link has been sent.",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Save token
    user.resetPasswordToken = token;
    user.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Build frontend reset link
    const frontendURL =
      process.env.NODE_ENV === "production"
        ? tenant.FRONTEND_URL_PRODUCTION
        : tenant.FRONTEND_URL_DEVELOPMENT;

    const resetLink =
      `${frontendURL}/reset-password/${token}`;

    // Send email
    await sendResetPasswordEmail(
      user.email,
      user.name,
      resetLink,
      client
    );

    return res.json({
      message:
        "If an account exists, a reset link has been sent.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


const resetPassword = async (req, res) => {
  const client = req.params.client;
  const { token } = req.params;
  const { newPassword } = req.body;

  const tenant = tenantConfigs[client];

  if (!tenant) {
    return res.status(400).json({
      message: "Unrecognized client",
    });
  }

  try {
    const db = await getTenantDB(client);
    const User = db.models.User || db.model("User", userSchema);

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link.",
      });
    }

    // Optional password validation
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters.",
      });
    }

    // Save new password
    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({
      message: "Password reset successfully.",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  signup,
  login,
  changePassword,
  requestVerification,
  verifyAccount,
  updateAccount,
  getMe,
  forgotPassword,
  resetPassword
};
