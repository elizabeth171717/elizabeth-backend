require("dotenv").config();

const bcrypt = require("bcryptjs");
const userSchema = require("./models/AnahuacUser");
const getTenantDB = require("./utils/getTenantDB");

(async () => {
  try {
    const db = await getTenantDB("anahuac");

    const User = db.models.User || db.model("User", userSchema);

    // Delete old admin accounts
    await User.deleteMany({
      email: {
        $in: [
          "owner@anahuac.com",
          "anahuacuniversalmenu@gmail.com",
        ],
      },
    });

    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Anahuac Admin",

      restaurantName: "Sample Restaurant",

      email: "anahuacuniversalmenu@gmail.com",

      password: hashed,

      role: "admin",

      isActive: true,

      isVerified: true,
    });

    console.log("✅ Admin created for tenant anahuac");

    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);

    process.exit(1);
  }
})();