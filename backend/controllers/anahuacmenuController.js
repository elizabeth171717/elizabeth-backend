const getTenantDB = require("../utils/getTenantDB");
const anahuacMenuSchema = require("../models/AnahuacMenu");
const sampleMenu = require("../data/sampleMenu");
const { broadcastMenuUpdate } = require("../utils/broadcast");

// =============================
// GET MENU (PER USER)
// =============================
const getMenu = async (req, res) => {
  const { client } = req.params;
  const userId = req.userId;

  try {
    const db = await getTenantDB(client);
    const Menu = db.models.Menu || db.model("Menu", anahuacMenuSchema);

    const menu = await Menu.findOne({ owner: userId });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    return res.json(menu);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching menu" });
  }
};


// =============================
// UPDATE MENU (PER USER)
// =============================
const updateMenu = async (req, res) => {
  const { client } = req.params;
  const userId = req.userId;

  console.log("🔥 UPDATE MENU HIT", client, "USER:", userId);

  try {
    const db = await getTenantDB(client);
    const Menu = db.models.Menu || db.model("Menu", anahuacMenuSchema);

    // ✅ UPDATE ONLY THIS USER MENU
    const updatedMenu = await Menu.findOneAndUpdate(
      { owner: userId },
      req.body,
      {
        new: true,
        overwrite: true,
      }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found for user" });
    }

    // ✅ Broadcast only for live tenant
    if (client === "anahuac") {
      broadcastMenuUpdate(updatedMenu);
    }

    return res.json(updatedMenu);
  } catch (error) {
    console.error("❌ Error updating menu:", error);
    return res.status(500).json({ message: "Error updating menu" });
  }
};

module.exports = { getMenu, updateMenu };
