const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  saveSnackList,
  getSnackList,
 
} = require("../controllers/snackListController");

const snackAuthMiddleware = require("../middleware/snackAuthMiddleware");

// Save or update a snack list
router.post(
  "/:client/snack-list",
  snackAuthMiddleware,
  saveSnackList
);

// Get the logged-in user's snack list
router.get(
  "/:client/snacklist",
  snackAuthMiddleware,
  getSnackList
);

module.exports = router;