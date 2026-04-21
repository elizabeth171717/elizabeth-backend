const express = require("express");
const router = express.Router({ mergeParams: true });

const { convertMenu } = require("../controllers/convertMenuController");

// POST /api/:client/convert-menu
router.post("/:client/convert-menu", convertMenu);

module.exports = router;