const jwt = require("jsonwebtoken");
const tenantConfigs = require("../config/tenantConfigs");
const getTenantDB = require("../utils/getTenantDB");
const userSchema = require("../models/AnahuacUser");

module.exports = async (req, res, next) => {
  const client = req.params.client;
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const tenant = tenantConfigs[client];
    if (!tenant) return res.status(400).json({ message: "Invalid tenant" });

    const decoded = jwt.verify(token, tenant.JWT_SECRET);

    // ✅ 1. Get tenant DB connection
    const db = await getTenantDB(client);

    // ✅ 2. Get model from THAT connection
    const User = db.models.User || db.model("User", userSchema);

    // ✅ 3. Query user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.sendStatus(404);
    if (user.role !== "admin") return res.sendStatus(403);

    req.user = user;
    req.userId = user._id;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.sendStatus(401);
  }
};
