
const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllUsers,
  adminUpdateUser,
  adminChangePassword
} = require("../controllers/anahuacAdminController");

const router = express.Router({ mergeParams: true });

// Admin managing users
router.get("/:client/users", adminMiddleware, getAllUsers);
router.put("/:client/users/:userId", adminMiddleware, adminUpdateUser);
router.put("/:client/users/:userId/password", adminMiddleware, adminChangePassword);

module.exports = router;
