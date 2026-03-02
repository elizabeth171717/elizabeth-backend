const jwt = require("jsonwebtoken");
const tenantConfigs = require("../config/tenantConfigs");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const client = req.params.client;

  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, tenantConfigs[client].JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

