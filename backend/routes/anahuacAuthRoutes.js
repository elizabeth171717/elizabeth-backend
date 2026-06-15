const express = require("express");
const {
  signup,
  login,
  changePassword,
  requestVerification,
  verifyAccount,
  updateAccount,
  getMe,
  forgotPassword,
  resetPassword
} = require("../controllers/anahuacUserController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });
console.log("🔥 AUTH ROUTES FILE LOADED");

// Public
router.post("/:client/signup", signup);
router.post("/:client/login", login);
router.post("/:client/request-verification", requestVerification);
router.post("/:client/verify", verifyAccount);
router.post(
  "/:client/forgot-password",
  forgotPassword
);

router.post(
  "/:client/reset-password/:token",
  resetPassword
);

// Logged-in user (their own account)
router.get("/:client/me", authMiddleware, getMe);
router.put("/:client/account", authMiddleware, updateAccount);
router.put("/:client/account/password", authMiddleware, changePassword);

module.exports = router;
