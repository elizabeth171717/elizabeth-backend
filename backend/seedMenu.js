require("dotenv").config();

const getTenantDB = require("./utils/getTenantDB");
const anahuacMenuSchema = require("./models/AnahuacMenu");
const sampleMenu = require("./data/sampleMenu");

(async () => {
  try {
    const db = await getTenantDB("anahuac");

    // 🔥 FORCE REMOVE OLD MODEL
    if (db.models.Menu) {
      delete db.models.Menu;
    }

    const Menu = db.model("Menu", anahuacMenuSchema);

    await Menu.deleteMany({});

    // ✅ FORCE restaurantName SO IT NEVER BLOCKS
    await Menu.create({
      restaurantName: sampleMenu.restaurantName || "Sample Menu",
      sections: sampleMenu.sections || [],
    });

    console.log("✅ Sample menu inserted for tenant: anahuac");
    process.exit();
  } catch (err) {
    console.error("❌ Failed to seed menu:", err);
    process.exit(1);
  }
})();
