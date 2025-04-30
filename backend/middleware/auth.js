// middleware/auth.js
const protectAdminRoute = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token || token !== "mock-admin-token") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  
    next();
  };
  
  module.exports = protectAdminRoute;
  