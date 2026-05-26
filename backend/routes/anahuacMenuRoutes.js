// routes/universalMenuRoutes.js
const express = require("express");
const router = express.Router();
const { getMenu, updateMenu, getPublicMenu  } = require("../controllers/anahuacmenuController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/:client/menu → get menu for tenant
router.get("/:client/menu", authMiddleware, getMenu);

// POST /api/:client/menu → update menu for tenant
router.put("/:client/menu", authMiddleware,updateMenu);

// 🌍 PUBLIC (Website - NO AUTH)
router.get("/:client/public-menu/:slug", getPublicMenu);

module.exports = router;