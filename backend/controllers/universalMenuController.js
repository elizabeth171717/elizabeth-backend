// controllers/universalMenuController.js
const menuSchema = require("../models/Menu");
const getTenantDB = require("../utils/getTenantDB");

// ✅ import the broadcast helper from server.js (adjust path as needed)
const { broadcastMenuUpdate } = require("../utils/broadcast");

// GET menu for a client
const getMenu = async (req, res) => {
  const { client } = req.params;
  try {
    const db = await getTenantDB(client);
    const Menu = db.models.Menu || db.model("Menu", menuSchema);
    const menu = await Menu.findOne(); // ✅ no clientId filter needed
    return res.json(menu);
  } catch (error) {
    console.error("❌ Error fetching menu:", error);
    return res.status(500).json({ message: "Error fetching menu" });
  }
};

// POST / update menu for a client
const updateMenu = async (req, res) => {
  const { client } = req.params;
  const { sections, restaurantName } = req.body; // ✅ also accept restaurantName
  try {
    const db = await getTenantDB(client);
    const Menu = db.models.Menu || db.model("Menu", menuSchema);
    const updatedMenu = await Menu.findOneAndUpdate(
      {}, // ✅ no filter, just update the tenant DB's single menu
      { restaurantName, sections },
      { upsert: true, new: true }
    );

 // ✅ Only broadcast if it's the universalmenu tenant
    if (client === "universalmenu") {
      broadcastMenuUpdate(updatedMenu);
    }

    return res.json(updatedMenu);
  } catch (error) {
    console.error("❌ Error updating menu:", error);
    return res.status(500).json({ message: "Error updating menu" });
  }
};

module.exports = { getMenu, updateMenu };
