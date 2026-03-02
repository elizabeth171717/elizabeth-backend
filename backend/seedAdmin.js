require("dotenv").config();


const bcrypt = require("bcryptjs");
const userSchema = require("./models/AnahuacUser");
const getTenantDB = require("./utils/getTenantDB");

(async () => {
  const db = await getTenantDB("anahuac"); // ← tenant name
  const User = db.models.User || db.model("User", userSchema);

  const hashed = await bcrypt.hash("admin123", 10);

  await User.create({
    email: "owner@anahuac.com",
    password: hashed,
    role: "admin",
  });

  console.log("Admin created for tenant anahuac");
  process.exit();
})();
