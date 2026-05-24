require("dotenv").config();

const getTenantDB = require("./utils/getTenantDB");
const anahuacMenuSchema = require("./models/AnahuacMenu");

(async () => {
  try {
    const db = await getTenantDB("anahuac");

    if (db.models.Menu) {
      delete db.models.Menu;
    }

    const Menu = db.model("Menu", anahuacMenuSchema);

    const menus = await Menu.find();

 const normalizeItem = (item) => {

  // ✅ REMOVE OLD FIELD PROPERLY
  item.set("price", undefined);

  // ✅ ADD NEW FIELDS
  if (item.basePrice === undefined) {
    item.set("basePrice", null);
  }

  if (!item.prices) {
    item.set("prices", {});
  }

  // ✅ FORCE mongoose to detect changes
  item.markModified("price");
  item.markModified("basePrice");
  item.markModified("prices");
};

    for (const menu of menus) {

      for (const section of menu.sections) {

        // SECTION ITEMS
        for (const item of section.items || []) {
          normalizeItem(item);
        }

        // GROUP ITEMS
        for (const group of section.groups || []) {

          for (const item of group.items || []) {
            normalizeItem(item);
          }
        }
      }

      await menu.save({ validateBeforeSave: false });
    }

    console.log("✅ Migration completed");

    process.exit();

  } catch (err) {

    console.error("❌ Migration failed:", err);

    process.exit(1);
  }
})();