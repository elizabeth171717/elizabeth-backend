// routes/universalMenuRoutes.js
const express = require("express");
const router = express.Router();
const { getMenu, updateMenu } = require("../controllers/universalMenuController");

// GET /api/:client/menu → get menu for tenant
router.get("/:client/menu", getMenu);

// POST /api/:client/menu → update menu for tenant
router.post("/:client/menu", updateMenu);

module.exports = router;



