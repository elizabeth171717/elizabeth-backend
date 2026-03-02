// routes/universalMenuRoutes.js
const express = require("express");
const router = express.Router();
const { getMenu, updateMenu } = require("../controllers/anahuacmenuController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/:client/menu → get menu for tenant
router.get("/:client/menu", authMiddleware, getMenu);

// POST /api/:client/menu → update menu for tenant
router.put("/:client/menu", authMiddleware,updateMenu);

module.exports = router;