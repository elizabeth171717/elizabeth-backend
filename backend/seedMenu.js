require("dotenv").config();

const getTenantDB = require("./utils/getTenantDB");
const anahuacMenuSchema = require("./models/AnahuacMenu");
const sampleMenu = require("./data/sampleMenu");

(async () => {
   try {
    const db = await getTenantDB("anahuac");

    // 🔥 FIX model overwrite issue
    if (db.models.Menu) {
      delete db.models.Menu;
    }

    const Menu = db.model("Menu", anahuacMenuSchema);

    console.log("DB NAME:", db.name);

   
    await Menu.deleteOne({ slug: "sample-menu" });

await Menu.create({
  restaurantName: sampleMenu.restaurantName,
    views: sampleMenu.views, // ✅ ADD THIS
  sections: sampleMenu.sections,
  slug: "sample-menu",
  isTemplate: true,
});

    console.log("✅ Sample menu inserted for tenant: anahuac");
    process.exit();
  } catch (err) {
    console.error("❌ Failed to seed menu:", err);
    process.exit(1);
  }
})();
